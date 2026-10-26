<?php

declare(strict_types=1);

namespace App\Tests\Unit\Platform\UI\Controller;

use App\Platform\UI\Controller\DefaultController;
use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\Container;
use Twig\Environment;

final class DefaultControllerTest extends TestCase
{
    public function testIndexRendersDefaultTemplateWithControllerName(): void
    {
        $twig = $this->createMock(Environment::class);
        $twig->expects(self::once())
            ->method('render')
            ->with('default/index.html.twig', ['controller_name' => 'DefaultController'])
            ->willReturn('<h1>rendered</h1>');

        $container = new Container();
        $container->set('twig', $twig);

        $controller = new DefaultController();
        $controller->setContainer($container);

        $response = $controller->index();

        self::assertSame('<h1>rendered</h1>', $response->getContent());
    }
}
