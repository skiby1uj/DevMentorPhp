<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\ApplicationTester;

final class SchemaTest extends DatabaseWebTestCase
{
    public function testMappingMatchesMigratedDatabase(): void
    {
        self::assertCommandSucceeds('doctrine:schema:validate');
    }

    public function testAllMigrationsAreApplied(): void
    {
        self::assertCommandSucceeds('doctrine:migrations:up-to-date');
    }

    private static function assertCommandSucceeds(string $command): void
    {
        $application = new Application(static::bootKernel());
        $application->setAutoExit(false);

        $tester = new ApplicationTester($application);
        $exitCode = $tester->run(['command' => $command]);

        self::assertSame(0, $exitCode, $tester->getDisplay());
    }
}
