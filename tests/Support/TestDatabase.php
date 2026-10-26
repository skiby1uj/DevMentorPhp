<?php

declare(strict_types=1);

namespace App\Tests\Support;

use Symfony\Component\Process\Process;
use Testcontainers\Container\StartedTestContainer;
use Testcontainers\Modules\PostgresContainer;

/**
 * Provides a throwaway PostgreSQL for integration tests and the ephemeral app.
 *
 * Starts one testcontainers instance per PHP process. When INTEGRATION_DATABASE_URL is set the container is skipped
 * and that server is used instead (environments without Docker).
 */
final class TestDatabase
{
    private const IMAGE_VERSION = '18-alpine';
    private const NAME = 'app';
    private const USER = 'app';
    private const PASSWORD = 'app';

    private static ?string $url = null;
    private static ?StartedTestContainer $container = null;

    /** Returns a DATABASE_URL pointing at a running server, starting the container on first use. */
    public static function url(): string
    {
        if (self::$url !== null) {
            return self::$url;
        }

        $external = getenv('INTEGRATION_DATABASE_URL');
        if (\is_string($external) && $external !== '') {
            return self::$url = $external;
        }

        $container = (new PostgresContainer(self::IMAGE_VERSION, self::USER, self::PASSWORD, self::NAME))
            ->withAutoRemove(true)
            ->start();
        self::$container = $container;
        register_shutdown_function(self::stop(...));

        return self::$url = sprintf(
            'postgresql://%s:%s@%s:%d/%s?serverVersion=18&charset=utf8',
            self::USER,
            self::PASSWORD,
            $container->getHost(),
            $container->getMappedPort(5432),
            self::NAME,
        );
    }

    /** Creates the database and applies all migrations for the given Symfony environment. */
    public static function migrate(string $environment): void
    {
        foreach ([
            ['doctrine:database:create', '--if-not-exists'],
            ['doctrine:migrations:migrate', '--no-interaction'],
        ] as $command) {
            self::console($environment, $command);
        }
    }

    /**
     * Runs bin/console against the throwaway database and fails loudly on a non-zero exit code.
     *
     * @param list<string> $arguments
     */
    public static function console(string $environment, array $arguments): void
    {
        $process = new Process(
            [\PHP_BINARY, \dirname(__DIR__, 2).'/bin/console', ...$arguments, '--env='.$environment],
            \dirname(__DIR__, 2),
            ['DATABASE_URL' => self::url(), 'APP_ENV' => $environment, 'APP_DEBUG' => '0', 'APP_SECRET' => 'ephemeral-secret'],
            null,
            120,
        );
        $process->mustRun();
    }

    public static function stop(): void
    {
        self::$container?->stop();
        self::$container = null;
        self::$url = null;
    }
}
