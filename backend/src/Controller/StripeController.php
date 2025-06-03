<?php
namespace App\Controller;

use App\Service\StripeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Repository\EventRepository;
use App\Entity\EventParticipant;

class StripeController extends AbstractController
{
    #[Route('/api/stripe/create-product', name: 'stripe_create_product', methods: ['POST'])]
    public function createProduct(Request $request, StripeService $stripeService): JsonResponse
    {
        // Prueba de log manual
        file_put_contents(__DIR__ . '/../../var/log/stripe_webhook.log', 'Prueba manual de log' . PHP_EOL, FILE_APPEND);
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
            $eventId = $data['eventId'] ?? null;
            $userId = $data['userId'] ?? null;

            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price' => $priceId,
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $_ENV['FRONTEND_URL'] . '/success?eventId=' . $eventId,
                'cancel_url' => $_ENV['FRONTEND_URL'] . '/cancel',
                'metadata' => [
                    'eventId' => $eventId,
                    'userId' => $userId,
                ],
            ]);
            return $this->json(['url' => $session->url]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/stripe/webhook', name: 'stripe_webhook', methods: ['POST'])]
    public function stripeWebhook(Request $request, EntityManagerInterface $em, UserRepository $userRepo, EventRepository $eventRepo): Response
    {
        $payload = $request->getContent();
        $sig_header = $request->headers->get('stripe-signature');
        $secret = $_ENV['STRIPE_WEBHOOK_SECRET']; 

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $secret);
        } catch (\Exception $e) {
            return new Response('Webhook error: ' . $e->getMessage(), 400);
        }

        file_put_contents(__DIR__ . '/../../var/log/stripe_webhook.log', 'Webhook recibido: ' . $request->getContent() . PHP_EOL, FILE_APPEND);

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            file_put_contents(__DIR__ . '/../../var/log/stripe_webhook.log', 'Session: ' . json_encode($session) . PHP_EOL, FILE_APPEND);

            $eventId = $session->metadata->eventId ?? null;
            $userId = $session->metadata->userId ?? null;
            file_put_contents(__DIR__ . '/../../var/log/stripe_webhook.log', 'eventId: ' . $eventId . ', userId: ' . $userId . PHP_EOL, FILE_APPEND);

            if ($eventId && $userId) {
                $user = $userRepo->find($userId);
                $eventEntity = $eventRepo->find($eventId);

                if ($user && $eventEntity) {
                    // Comprueba si ya está inscrito
                    $already = $em->getRepository(EventParticipant::class)->findOneBy([
                        'user' => $user,
                        'event' => $eventEntity,
                    ]);
                    if (!$already) {
                        $participant = new EventParticipant();
                        $participant->setUser($user);
                        $participant->setEvent($eventEntity);
                        $participant->setJoinedAt(new \DateTime());
                        $em->persist($participant);
                        $em->flush();
                    }
                }
            }
        }

        return new Response('Webhook recibido', 200);
    }
} 