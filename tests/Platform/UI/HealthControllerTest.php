<?php

declare(strict_types=1);

namespace App\Tests\Platform\UI;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class HealthControllerTest extends WebTestCase
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
