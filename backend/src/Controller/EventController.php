<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Event;
use App\Repository\EventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/events')]
class EventController extends AbstractController
{
    #[Route('/', name: 'event_list', methods: ['GET'])]
    public function list(EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->findAll();
        $data = [];
        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()?->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage(),
                'state' => $event->getState(),
                'subcategory' => $event->getSubcategory(),
                'price' => $event->getPrice(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/{id}', name: 'event_show', methods: ['GET'])]
    public function show(Event $event): JsonResponse
    {
        $data = [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()?->format('Y-m-d H:i:s'),
            'location' => $event->getLocation(),
            'category' => $event->getCategory(),
            'capacity' => $event->getCapacity(),
            'image' => $event->getImage(),
            'state' => $event->getState(),
            'subcategory' => $event->getSubcategory(),
            'price' => $event->getPrice(),
        ];
        return new JsonResponse($data);
    }

    #[Route('/', name: 'event_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $event = new Event();
        $event->setTitle($data['title'] ?? null);
        $event->setDescription($data['description'] ?? null);
        $event->setDate(isset($data['date']) ? new \DateTime($data['date']) : null);
        $event->setLocation($data['location'] ?? null);
        $event->setCategory($data['category'] ?? null);
        $event->setCapacity($data['capacity'] ?? null);
        $event->setImage($data['image'] ?? null);
        $event->setState($data['state'] ?? null);
        $event->setSubcategory($data['subcategory'] ?? false);
        $event->setPrice($data['price'] ?? null);

        $em->persist($event);
        $em->flush();

        return new JsonResponse(['message' => 'Evento creado', 'id' => $event->getId()], 201);
    }

    #[Route('/{id}', name: 'event_update', methods: ['PUT', 'PATCH'])]
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
        $event->setState($data['state'] ?? $event->getState());
        $event->setSubcategory($data['subcategory'] ?? $event->getSubcategory());
        $event->setPrice($data['price'] ?? $event->getPrice());

        $em->flush();

        return new JsonResponse(['message' => 'Evento actualizado']);
    }

    #[Route('/{id}', name: 'event_delete', methods: ['DELETE'])]
    public function delete(Event $event, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($event);
        $em->flush();

        return new JsonResponse(['message' => 'Evento eliminado']);
    }
}
