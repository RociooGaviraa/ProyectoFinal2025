<?php

namespace App\Controller;

use App\Entity\Event;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

#[Route('/api')]
class ApiController extends AbstractController
{
    // #[Route('/events', name: 'get_events', methods: ['GET'])]
    // public function getEvents(EntityManagerInterface $entityManager): JsonResponse
    // {
    //     $events = $entityManager->getRepository(Event::class)->findAll();
    //     return $this->json($events, 200, [], ['groups' => 'event']);
    // }

    // #[Route('/events/{id}', name: 'get_event', methods: ['GET'])]
    // public function getEvent(Event $event): JsonResponse
    // {
    //     return $this->json($event, 200, [], ['groups' => 'event']);
    // }

    #[Route('/events', name: 'create_event', methods: ['POST'])]
    public function createEvent(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar campos obligatorios
        if (
            empty($data['title']) ||
            empty($data['description']) ||
            empty($data['date']) ||
            empty($data['location']) ||
            empty($data['category']) ||
            empty($data['capacity'])
        ) {
            return $this->json(['message' => 'Faltan campos obligatorios'], 400);
        }

        $event = new Event();
        $event->setTitle($data['title']);
        $event->setDescription($data['description']);
        $event->setDate(new \DateTime($data['date']));
        $event->setLocation($data['location']);
        $event->setCategory($data['category']);
        $event->setCapacity((int)$data['capacity']);
        $event->setImage($data['image'] ?? null);

        $entityManager->persist($event);
        $entityManager->flush();

        return $this->json([
            'message' => 'Evento creado correctamente',
            'event' => [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
            ]
        ], 201);
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        try {
            $content = $request->getContent();
            error_log('Raw request content: ' . $content);
            
            $data = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return $this->json([
                    'message' => 'Invalid JSON data',
                    'error' => json_last_error_msg()
                ], 400);
            }

            error_log('Parsed data: ' . print_r($data, true));

            // Check exact field values
            $fieldValues = [
                'name' => $data['name'] ?? 'not set',
                'surname' => $data['surname'] ?? 'not set',
                'email' => $data['email'] ?? 'not set',
                'username' => $data['username'] ?? 'not set',
                'birthDate' => $data['birthDate'] ?? 'not set',
                'password' => isset($data['password']) ? 'set' : 'not set'
            ];
            error_log('Field values: ' . print_r($fieldValues, true));

            // Validate fields
            $requiredFields = ['email', 'username', 'password', 'name', 'surname', 'birthDate'];
            $missingFields = [];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                    $missingFields[] = $field;
                }
            }

            if (!empty($missingFields)) {
                return $this->json([
                    'message' => 'Missing required fields: ' . implode(', ', $missingFields),
                    'received_fields' => array_keys($data),
                    'field_values' => $fieldValues
                ], 400);
            }

            // Create new user
            $user = new User();
            $user->setEmail($data['email']);
            $user->setUsername($data['username']);
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
            $user->setName($data['name']);
            $user->setSurname($data['surname']);
            $user->setBirthDate(new \DateTime($data['birthDate']));
            $user->setRoles(['ROLE_USER']);
            
            if (isset($data['profile'])) {
                $user->setProfile($data['profile']);
            }

            // Debug the user object before persist
            error_log('User object before persist: ' . print_r([
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'name' => $user->getName(),
                'surname' => $user->getSurname(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d')
            ], true));

            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'surname' => $user->getSurname()
                ]
            ], 201);

        } catch (\Exception $e) {
            error_log('Registration error: ' . $e->getMessage());
            return $this->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!isset($data['email']) || !isset($data['password'])) {
                return $this->json([
                    'message' => 'Email and password are required'
                ], 400);
            }

            $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

            if (!$user) {
                return $this->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
                return $this->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Return successful login response with user data
            return $this->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'roles' => $user->getRoles()
                ]
            ]);

        } catch (\Exception $e) {
            error_log('Login error: ' . $e->getMessage());
            return $this->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}