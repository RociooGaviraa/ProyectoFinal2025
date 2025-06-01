<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Event;

#[Route('/api')]
final class UserController extends AbstractController
{
    #[Route('/users', name: 'admin_users_list', methods: ['GET'])]
    public function listUsers(EntityManagerInterface $em): JsonResponse
    {
        $users = $em->getRepository(\App\Entity\User::class)->findAll();
        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles' => $user->getRoles(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/users/{id}/events', name: 'admin_user_events', methods: ['GET'])]
    public function userEvents(
        int $id,
        EntityManagerInterface $em,
        \App\Repository\EventParticipantRepository $eventParticipantRepository
    ): JsonResponse {
        $user = $em->getRepository(\App\Entity\User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        $participations = $eventParticipantRepository->findBy(['user' => $user]);
        $events = [];
        foreach ($participations as $participation) {
            $event = $participation->getEvent();
            if (!$event) continue;
            $events[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
            ];
        }
        return new JsonResponse($events);
    }

    #[Route('/users/{id}', name: 'get_user_by_id', methods: ['GET'])]
    public function getUserById(int $id, EntityManagerInterface $em): JsonResponse
    {
        $user = $em->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'surname' => $user->getSurname(),
        ]);
    }

    #[Route('/users/{id}/events/created', name: 'admin_user_created_events', methods: ['GET'])]
    public function userCreatedEvents(
        int $id,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $em->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
        $events = $em->getRepository(Event::class)->findBy(['organizer' => $user]);
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
                'image' => $event->getImage()
            ];
        }
        return new JsonResponse($data);
    }
}
