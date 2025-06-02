<?php
namespace App\Controller;

use App\Service\StripeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class StripeController extends AbstractController
{
    #[Route('/api/stripe/create-product', name: 'stripe_create_product', methods: ['POST'])]
    public function createProduct(Request $request, StripeService $stripeService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? 0;

        if (!$name || !$price) {
            return $this->json(['error' => 'Nombre y precio son obligatorios'], 400);
        }

        try {
            $result = $stripeService->createProductWithPrice($name, $description, $price);
            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/stripe/create-checkout-session', name: 'stripe_create_checkout_session', methods: ['POST'])]
    public function createCheckoutSession(Request $request, StripeService $stripeService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $priceId = $data['priceId'] ?? null;
        if (!$priceId) {
            return $this->json(['error' => 'Falta el priceId'], 400);
        }
        try {
            \Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY'));
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price' => $priceId,
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $_ENV['FRONTEND_URL'] . '/success',
                'cancel_url' => $_ENV['FRONTEND_URL'] . '/cancel',
            ]);
            return $this->json(['url' => $session->url]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
} 