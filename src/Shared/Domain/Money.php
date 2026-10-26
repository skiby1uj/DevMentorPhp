<?php

declare(strict_types=1);

namespace App\Shared\Domain;

/**
 * Amount of money in the smallest currency unit (e.g. grosze). Never uses floats.
 */
final readonly class Money
{
    /**
     * @param int    $amount   amount in minor units; may be negative (refunds, ledger debits)
     * @param string $currency ISO 4217 code, upper case
     */
    public function __construct(
        public int $amount,
        public string $currency,
    ) {
        if (preg_match('/^[A-Z]{3}$/', $currency) !== 1) {
            throw new \InvalidArgumentException(sprintf('Invalid currency code "%s".', $currency));
        }
    }

    public static function pln(int $amount): self
    {
        return new self($amount, 'PLN');
    }

    public function add(self $other): self
    {
        $this->assertSameCurrency($other);

        return new self($this->amount + $other->amount, $this->currency);
    }

    public function subtract(self $other): self
    {
        $this->assertSameCurrency($other);

        return new self($this->amount - $other->amount, $this->currency);
    }

    /**
     * Takes a percentage (in basis points, 100 bp = 1%), rounding half up to the nearest minor unit.
     */
    public function percentage(int $basisPoints): self
    {
        $scaled = $this->amount * $basisPoints;
        $rounded = intdiv(abs($scaled) + 5000, 10000);

        return new self($scaled < 0 ? -$rounded : $rounded, $this->currency);
    }

    public function isNegative(): bool
    {
        return $this->amount < 0;
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount && $this->currency === $other->currency;
    }

    private function assertSameCurrency(self $other): void
    {
        if ($this->currency !== $other->currency) {
            throw new \InvalidArgumentException(sprintf('Currency mismatch: %s vs %s.', $this->currency, $other->currency));
        }
    }
}
