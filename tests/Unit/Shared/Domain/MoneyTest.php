<?php

declare(strict_types=1);

namespace App\Tests\Unit\Shared\Domain;

use App\Shared\Domain\Money;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class MoneyTest extends TestCase
{
    public function testAddsAndSubtractsInMinorUnits(): void
    {
        self::assertTrue(Money::pln(1250)->add(Money::pln(50))->equals(Money::pln(1300)));
        self::assertTrue(Money::pln(1250)->subtract(Money::pln(1300))->isNegative());
    }

    public function testRejectsMixedCurrencies(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        Money::pln(100)->add(new Money(100, 'EUR'));
    }

    #[DataProvider('invalidCurrencies')]
    public function testRejectsInvalidCurrencyCode(string $code): void
    {
        $this->expectException(\InvalidArgumentException::class);

        new Money(1, $code);
    }

    /** @return iterable<string, array{string}> */
    public static function invalidCurrencies(): iterable
    {
        yield 'lower case' => ['pln'];
        yield 'too short' => ['PL'];
        yield 'empty' => [''];
    }

    #[DataProvider('commissions')]
    public function testPercentageRoundsHalfUp(int $amount, int $basisPoints, int $expected): void
    {
        self::assertSame($expected, Money::pln($amount)->percentage($basisPoints)->amount);
    }

    /** @return iterable<string, array{int, int, int}> */
    public static function commissions(): iterable
    {
        yield '20% of 120 PLN' => [12000, 2000, 2400];
        yield 'rounds half up' => [1005, 2000, 201];
        yield 'rounds down below half' => [1002, 2000, 200];
        yield 'negative amount mirrors' => [-1005, 2000, -201];
    }
}
