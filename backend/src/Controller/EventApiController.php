<?php

namespace App\Controller;

use App\Entity\Event;
use App\Repository\EventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Repository\EventParticipantRepository;
use App\Service\StripeService;

#[Route('/api', name: 'api_')]
class EventApiController extends AbstractController
{
    #[Route('/events', name: 'events_list', methods: ['GET'])]
    public function list(EventRepository $eventRepository, \App\Repository\EventParticipantRepository $eventParticipantRepository): JsonResponse
    {
        $events = $eventRepository->findAll();
        $data = [];

        foreach ($events as $event) {
            $attendeesCount = $eventParticipantRepository->countByEvent($event);
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
                'attendees' => $attendeesCount,
                'state' => $event->getState(),
                'lat' => $event->getLat(),
                'lng' => $event->getLng(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/events/category/{category}', name: 'events_by_category', methods: ['GET'])]
    public function listByCategory(string $category, EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->findBy(['category' => $category]);
        $data = [];

        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
                'state' => $event->getState(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/events/detail/{id}', name: 'event_show', methods: ['GET'])]
    public function show(int $id, EventRepository $eventRepository): JsonResponse
    {
        $event = $eventRepository->find($id);
        
        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], 404);
        }

        $data = [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('Y-m-d H:i:s'),
            'location' => $event->getLocation(),
            'category' => $event->getCategory(),
            'capacity' => $event->getCapacity(),
            'image' => $event->getImage(),
            'state' => $event->getState(),
        ];

        return new JsonResponse($data);
    }

    #[Route('/events/init', name: 'init_events', methods: ['GET'])]
    public function initializeEvents(EntityManagerInterface $entityManager): JsonResponse
    {
        $sampleEvents = [
            [
                'title' => 'Tech Innovation Summit',
                'description' => 'Annual technology conference featuring industry leaders',
                'date' => new \DateTime('2024-06-15 09:00:00'),
                'location' => 'Madrid Convention Center',
                'category' => 'conference',
                'capacity' => 500,
                'image' => 'https://picsum.photos/800/400?random=1'
            ],
            [
                'title' => 'Web Development Workshop',
                'description' => 'Hands-on React and Node.js workshop',
                'date' => new \DateTime('2024-07-20 10:00:00'),
                'location' => 'Barcelona Tech Hub',
                'category' => 'workshop',
                'capacity' => 30,
                'image' => 'https://picsum.photos/800/400?random=2'
            ],
            [
                'title' => 'Digital Marketing Seminar',
                'description' => 'Latest trends in digital marketing',
                'date' => new \DateTime('2024-08-10 14:00:00'),
                'location' => 'Sevilla Business School',
                'category' => 'seminar',
                'capacity' => 100,
                'image' => 'https://picsum.photos/800/400?random=3'
            ],
            [
                'title' => 'Startup Networking Night',
                'description' => 'Connect with entrepreneurs and investors',
                'date' => new \DateTime('2024-06-25 18:00:00'),
                'location' => 'Valencia Innovation Hub',
                'category' => 'networking',
                'capacity' => 150,
                'image' => 'https://picsum.photos/800/400?random=4'
            ],
            [
                'title' => 'Contemporary Art Exhibition',
                'description' => 'Featuring works from emerging Spanish artists',
                'date' => new \DateTime('2024-07-05 11:00:00'),
                'location' => 'Madrid Modern Art Gallery',
                'category' => 'cultural',
                'capacity' => 200,
                'image' => 'https://picsum.photos/800/400?random=5'
            ],
            [
                'title' => 'City Marathon 2024',
                'description' => 'Annual city marathon with 5K and 10K options',
                'date' => new \DateTime('2024-09-01 07:00:00'),
                'location' => 'Barcelona City Center',
                'category' => 'sports',
                'capacity' => 1000,
                'image' => 'https://picsum.photos/800/400?random=6'
            ]
        ];

        foreach ($sampleEvents as $eventData) {
            $event = new Event();
            $event->setTitle($eventData['title']);
            $event->setDescription($eventData['description']);
            $event->setDate($eventData['date']);
            $event->setLocation($eventData['location']);
            $event->setCategory($eventData['category']);
            $event->setCapacity($eventData['capacity']);
            $event->setImage($eventData['image']);
            
            $eventDate = $event->getDate();
            $now = new \DateTime();
            $enProcesoFin = (clone $eventDate)->modify('+1 hour 30 minutes');

            if ($now < $eventDate) {
                $event->setState('Abierto');
            } elseif ($now >= $eventDate && $now < $enProcesoFin) {
                $event->setState('En proceso');
            } else {
                $event->setState('Finalizado');
            }

            $entityManager->persist($event);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Sample events have been created']);
    }
    
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Aquí deberías implementar la lógica de autenticación real
        // Por ahora, solo devolvemos una respuesta de ejemplo
        if ($data && isset($data['email']) && isset($data['password'])) {
            return new JsonResponse([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'email' => $data['email']
                ]
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    #[Route('/events', name: 'event_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, #[CurrentUser] ?\App\Entity\User $user = null, StripeService $stripeService): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $data = json_decode($request->getContent(), true);

        // Validación básica
        if (
            !isset($data['title'], $data['description'], $data['date'], $data['location'], $data['category'], $data['capacity'])
            || empty($data['title']) || empty($data['description']) || empty($data['date']) || empty($data['location']) || empty($data['category'])
        ) {
            return new JsonResponse(['error' => 'Missing or invalid fields'], 400);
        }

        $event = new Event();
        $event->setTitle($data['title']);
        $event->setDescription($data['description']);
        $event->setDate(new \DateTime($data['date']));
        $event->setLocation($data['location']);
        $event->setCategory($data['category']);
        $event->setCapacity((int)$data['capacity']);
        $event->setImage($data['image'] ?? null);
        $event->setOrganizer($user);
        // Guarda state, subcategory y price si existen
        if (isset($data['subcategory'])) $event->setSubcategory($data['subcategory']);
        if (isset($data['price'])) $event->setPrice($data['price']);

        // Geocodificar la dirección para obtener lat/lng
        if (!empty($data['location'])) {
            error_log('Geocodificando dirección: ' . $data['location']);
            $coords = $this->getCoordinatesFromAddress($data['location']);
            error_log('Coordenadas obtenidas: ' . print_r($coords, true));
            if ($coords) {
                $event->setLat($coords['lat']);
                $event->setLng($coords['lng']);
            }
        }

        // Si el evento tiene precio, crear producto y precio en Stripe y guardar el priceId
        if (isset($data['price']) && floatval($data['price']) > 0) {
            $stripeResult = $stripeService->createProductWithPrice(
                $event->getTitle(),
                $event->getDescription(),
                floatval($event->getPrice())
            );
            $event->setStripePriceId($stripeResult['priceId']);
        }

        $eventDate = $event->getDate();
        $now = new \DateTime();
        $enProcesoFin = (clone $eventDate)->modify('+1 hour 30 minutes');

        if ($now < $eventDate) {
            $event->setState('Abierto');
        } elseif ($now >= $eventDate && $now < $enProcesoFin) {
            $event->setState('En proceso');
        } else {
            $event->setState('Finalizado');
        }

        $entityManager->persist($event);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Event created successfully',
            'event' => [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
                'subcategory' => $event->getSubcategory(),
                'price' => $event->getPrice(),
                'stripePriceId' => $event->getStripePriceId(),
                'organizer' => $user->getId(),
                'state' => $event->getState(),
            ]
        ], 201);
    }

    #[Route('/events/mine', name: 'my_events', methods: ['GET'])]
    public function myEvents(
        EventParticipantRepository $eventParticipantRepository,
        #[CurrentUser] ?\App\Entity\User $user = null
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }

        $participations = $eventParticipantRepository->findBy(['user' => $user]);
        $events = [];
        foreach ($participations as $participation) {
            $event = $participation->getEvent();
            if (!$event) continue;
            $events[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
                'state' => $event->getState(),
            ];
        }

        return new JsonResponse($events);
    }

    #[Route('/events/created', name: 'my_created_events', methods: ['GET'])]
    public function myCreatedEvents(
        EventRepository $eventRepository,
        #[CurrentUser] ?\App\Entity\User $user = null
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }

        // Devuelve los eventos cuyo creador es el usuario autenticado
        $events = $eventRepository->findBy(['organizer' => $user]);
        $data = [];
        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
                'state' => $event->getState(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/events/{id}', name: 'event_detail', methods: ['GET'])]
    public function getEventById(
        int $id,
        EventRepository $eventRepository,
        \App\Repository\EventParticipantRepository $eventParticipantRepository,
        #[CurrentUser] ?\App\Entity\User $user = null
    ): JsonResponse {
        $event = $eventRepository->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], 404);
        }

        // Contar asistentes reales en la tabla intermedia
        $attendeesCount = $eventParticipantRepository->countByEvent($event);

        // Comprobar si el usuario está inscrito
        $isJoined = false;
        if ($user) {
            $isJoined = $eventParticipantRepository->isUserJoinedToEvent($user, $event);
        }

        $data = [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('Y-m-d H:i:s'),
            'location' => $event->getLocation(),
            'category' => $event->getCategory(),
            'capacity' => $event->getCapacity(),
            'image' => $event->getImage(),
            'attendeesCount' => $attendeesCount,
            'isJoined' => $isJoined,
            'organizer' => $event->getOrganizer() ? [
                'id' => $event->getOrganizer()->getId(),
                'name' => $event->getOrganizer()->getName(),
                'surname' => $event->getOrganizer()->getSurname(),
                'photo' => $event->getOrganizer()->getProfile(),
            ] : null,
            'state' => $event->getState(),
            'price' => $event->getPrice(),
            'stripePriceId' => $event->getStripePriceId(),
        ];
        return new JsonResponse($data);
    }

    #[Route('/events/{id}/join', name: 'event_join', methods: ['POST'])]
    public function joinEvent(int $id, EventRepository $eventRepository, EntityManagerInterface $em, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $event = $eventRepository->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Evento no encontrado'], 404);
        }
        if ($event->getAttendees()->contains($user)) {
            return new JsonResponse(['message' => 'Ya inscrito']);
        }
        $event->addAttendee($user);
        $em->flush();
        return new JsonResponse(['message' => 'Inscripción exitosa']);
    }

    #[Route('/events/{id}/leave', name: 'event_leave', methods: ['POST'])]
    public function leaveEvent(int $id, EventRepository $eventRepository, EntityManagerInterface $em, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $event = $eventRepository->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Evento no encontrado'], 404);
        }
        if (!$event->getAttendees()->contains($user)) {
            return new JsonResponse(['message' => 'No estabas inscrito']);
        }
        $event->removeAttendee($user);
        $em->flush();
        return new JsonResponse(['message' => 'Inscripción cancelada']);
    }

    #[Route('/events/{id}', name: 'event_update', methods: ['PUT', 'PATCH'])]
    public function update(Event $event, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $event->setTitle($data['title'] ?? $event->getTitle());
        $event->setDescription($data['description'] ?? $event->getDescription());
        $event->setDate(isset($data['date']) ? new \DateTime($data['date']) : $event->getDate());
        $event->setLocation($data['location'] ?? $event->getLocation());
        $event->setCategory($data['category'] ?? $event->getCategory());
        $event->setCapacity($data['capacity'] ?? $event->getCapacity());
        $event->setImage($data['image'] ?? $event->getImage());
        $event->setSubcategory($data['subcategory'] ?? $event->getSubcategory());
        $event->setPrice($data['price'] ?? $event->getPrice());

        // --- Lógica para recalcular el estado ---
        $eventDate = $event->getDate();
        $now = new \DateTime();
        $enProcesoFin = (clone $eventDate)->modify('+1 hour 30 minutes');

        if ($now < $eventDate) {
            $event->setState('Abierto');
        } elseif ($now >= $eventDate && $now < $enProcesoFin) {
            $event->setState('En proceso');
        } else {
            $event->setState('Finalizado');
        }
        // ----------------------------------------

        $em->flush();

        return new JsonResponse(['message' => 'Evento actualizado']);
    }

    /**
     * Geocodifica una dirección usando Nominatim (OpenStreetMap)
     */
    private function getCoordinatesFromAddress(string $address): ?array
    {
        $url = 'https://nominatim.openstreetmap.org/search?format=json&q=' . urlencode($address);
        $opts = [
            "http" => [
                "header" => "User-Agent: Eventfy/1.0\r\n"
            ]
        ];
        $context = stream_context_create($opts);
        $response = @file_get_contents($url, false, $context);
        if ($response === false) return null;
        $data = json_decode($response, true);
        if (!empty($data) && isset($data[0]['lat'], $data[0]['lon'])) {
            return [
                'lat' => (float)$data[0]['lat'],
                'lng' => (float)$data[0]['lon'],
            ];
        }
        return null;
    }
}
