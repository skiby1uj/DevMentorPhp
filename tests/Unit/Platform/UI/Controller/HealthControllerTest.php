<?php

declare(strict_types=1);

namespace App\Tests\Unit\Platform\UI\Controller;

use App\Platform\UI\Controller\HealthController;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\DBAL\Result;
use PHPUnit\Framework\TestCase;

final class HealthControllerTest extends TestCase
{
    public function testLivenessDoesNotTouchTheDatabase(): void
    {
        $connection = $this->createMock(Connection::class);
        $connection->expects(self::never())->method('executeQuery');

        $response = (new HealthController($connection))->live();

        self::assertSame(200, $response->getStatusCode());
        self::assertJsonStringEqualsJsonString('{"status":"ok"}', (string) $response->getContent());
    }

    public function testReadinessReportsDatabaseUp(): void
    {
        $result = $this->createStub(Result::class);
        $result->method('fetchOne')->willReturn(1);
        $connection = $this->createMock(Connection::class);
        $connection->expects(self::once())->method('executeQuery')->with('SELECT 1')->willReturn($result);

        $response = (new HealthController($connection))->ready();

        self::assertSame(200, $response->getStatusCode());
        self::assertJsonStringEqualsJsonString('{"status":"ok","checks":{"database":"up"}}', (string) $response->getContent());
    }

    public function testReadinessReports503WhenDatabaseIsDown(): void
    {
        $connection = $this->createStub(Connection::class);
        $connection->method('executeQuery')->willThrowException($this->createStub(ConnectionException::class));

        $response = (new HealthController($connection))->ready();

        self::assertSame(503, $response->getStatusCode());
        self::assertJsonStringEqualsJsonString('{"status":"unavailable","checks":{"database":"down"}}', (string) $response->getContent());
    }
}
