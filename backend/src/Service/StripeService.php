<?php
namespace App\Service;

use Stripe\StripeClient;

class StripeService
{
    private $stripe;

    public function __construct(string $secretKey)
    {
        $this->stripe = new StripeClient($secretKey);
    }

    public function createProductWithPrice(string $name, string $description, float $price, string $currency = 'eur')
    {
        $product = $this->stripe->products->create([
            'name' => $name,
            'description' => $description,
        ]);

        $priceObj = $this->stripe->prices->create([
            'product' => $product->id,
            'unit_amount' => intval($price * 100),
            'currency' => $currency,
        ]);

        return [
            'productId' => $product->id,
            'priceId' => $priceObj->id,
        ];
    }
} 