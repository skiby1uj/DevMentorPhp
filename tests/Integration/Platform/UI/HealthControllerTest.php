<?php

declare(strict_types=1);

namespace App\Tests\Integration\Platform\UI;

use App\Tests\Integration\DatabaseWebTestCase;

final class HealthControllerTest extends DatabaseWebTestCase
{
    public function testLivenessIsOk(): void
    {
        $client = static::createClient();
        $client->request('GET', '/health/live');

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString('{"status":"ok"}', (string) $client->getResponse()->getContent());
    }

    public function testReadinessReportsDatabaseUp(): void
    {
        $client = static::createClient();
        $client->request('GET', '/health/ready');

        self::assertResponseIsSuccessful();
        self::assertJsonStringEqualsJsonString('{"status":"ok","checks":{"database":"up"}}', (string) $client->getResponse()->getContent());
    }
}
