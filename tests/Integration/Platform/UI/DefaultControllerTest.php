<?php

declare(strict_types=1);

namespace App\Tests\Integration\Platform\UI;

use App\Tests\Integration\DatabaseWebTestCase;

final class DefaultControllerTest extends DatabaseWebTestCase
{
    public function testHomePageRenders(): void
    {
        $client = static::createClient();
        $client->request('GET', '/');

        self::assertResponseIsSuccessful();
        self::assertSelectorTextContains('h1', 'Hello DefaultController!');
    }
}
