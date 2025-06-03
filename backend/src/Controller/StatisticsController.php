<?php

namespace App\Controller;

use App\Repository\EventRepository;
use App\Repository\UserRepository;
use App\Repository\EventParticipantRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/stats')]
class StatisticsController extends AbstractController
{
    #[Route('/top-events', name: 'stats_top_events', methods: ['GET'])]
    public function topEvents(EventRepository $eventRepository, EventParticipantRepository $eventParticipantRepository): JsonResponse
    {
        // Obtener todos los eventos y contar inscripciones
        $events = $eventRepository->findAll();
        $data = [];
        foreach ($events as $event) {
            $count = $eventParticipantRepository->countByEvent($event);
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'attendees' => $count,
            ];
        }
        // Ordenar por inscripciones descendente
        usort($data, fn($a, $b) => $b['attendees'] <=> $a['attendees']);
        return new JsonResponse($data);
    }

    #[Route('/top-creators', name: 'stats_top_creators', methods: ['GET'])]
    public function topCreators(UserRepository $userRepository, EventRepository $eventRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];
        foreach ($users as $user) {
            $count = $eventRepository->count(['organizer' => $user]);
            if ($count > 0) {
                $data[] = [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'surname' => $user->getSurname(),
                    'email' => $user->getEmail(),
                    'created_events' => $count,
                ];
            }
        }
        usort($data, fn($a, $b) => $b['created_events'] <=> $a['created_events']);
        return new JsonResponse($data);
    }

    #[Route('/top-attendees', name: 'stats_top_attendees', methods: ['GET'])]
    public function topAttendees(UserRepository $userRepository, EventParticipantRepository $eventParticipantRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];
        foreach ($users as $user) {
            $count = $eventParticipantRepository->count(['user' => $user]);
            if ($count > 0) {
                $data[] = [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'surname' => $user->getSurname(),
                    'email' => $user->getEmail(),
                    'attended_events' => $count,
                ];
            }
        }
        usort($data, fn($a, $b) => $b['attended_events'] <=> $a['attended_events']);
        // Solo el usuario con más inscripciones
        $top = $data[0] ?? null;
        return new JsonResponse($top);
    }
} 