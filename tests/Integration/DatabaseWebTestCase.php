<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use App\Tests\Support\TestDatabase;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Base class for tests that need the kernel and a real PostgreSQL with all migrations applied.
 */
abstract class DatabaseWebTestCase extends WebTestCase
{
    private static bool $migrated = false;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        $url = TestDatabase::url();
        putenv('DATABASE_URL='.$url);
        $_SERVER['DATABASE_URL'] = $_ENV['DATABASE_URL'] = $url;

        if (!self::$migrated) {
            TestDatabase::migrate('test');
            self::$migrated = true;
        }
    }
}
