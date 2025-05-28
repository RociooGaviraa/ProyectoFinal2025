<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;
use Psr\Log\LoggerInterface;

#[Route('/api')]
class SecurityApiController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/login_check', name: 'api_login_check', methods: ['POST', 'OPTIONS'])]
    public function loginCheck(Request $request, JWTTokenManagerInterface $jwtManager): Response
    {
        $this->logger->info('Login check request received', [
            'method' => $request->getMethod(),
            'headers' => $request->headers->all(),
            'content' => $request->getContent()
        ]);

        // Manejar petición OPTIONS (preflight)
        if ($request->getMethod() === 'OPTIONS') {
            $response = new Response();
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Max-Age', '3600');
            return $response;
        }

        try {
            $data = json_decode($request->getContent(), true);
            $this->logger->info('Login attempt', ['email' => $data['email'] ?? 'no email provided']);
            
            if (!isset($data['email']) || !isset($data['password'])) {
                $this->logger->warning('Missing credentials', ['data' => $data]);
                return $this->json([
                    'message' => 'Email and password are required'
                ], 400);
            }

            /** @var User|null $user */
            $user = $this->getUser();

            if (!$user) {
                $this->logger->warning('Invalid credentials', ['email' => $data['email']]);
                return $this->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $token = $jwtManager->create($user);
            $this->logger->info('Login successful', ['user_id' => $user->getId()]);

            $response = $this->json([
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'surname' => $user->getSurname(),
                    'roles' => $user->getRoles(),
                    'profile' => $user->getProfile(),
                ]
            ]);

            // Agregar headers CORS a la respuesta
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');

            return $response;

        } catch (\Exception $e) {
            $this->logger->error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $response = $this->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);

            // Agregar headers CORS a la respuesta de error
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');

            return $response;
        }
    }
} 