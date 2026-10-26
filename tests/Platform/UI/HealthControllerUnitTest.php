<?php

declare(strict_types=1);

namespace App\Tests\Platform\UI;

use App\Platform\UI\Controller\HealthController;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception\ConnectionException;
use PHPUnit\Framework\TestCase;

final class HealthControllerUnitTest extends TestCase
{
    public function testReadinessReports503WhenDatabaseIsDown(): void
    {
        $connection = $this->createStub(Connection::class);
        $connection->method('executeQuery')->willThrowException($this->createStub(ConnectionException::class));

        $response = (new HealthController($connection))->ready();

        self::assertSame(503, $response->getStatusCode());
        self::assertJsonStringEqualsJsonString('{"status":"unavailable","checks":{"database":"down"}}', (string) $response->getContent());
    }
}
