<?php

namespace App\Controller;

use App\Entity\EventParticipant;
use App\Entity\Event;
use App\Entity\User;
use App\Repository\EventParticipantRepository;
use App\Repository\EventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/event-participants')]
class EventParticipantController extends AbstractController
{
    #[Route('/', name: 'event_participant_list', methods: ['GET'])]
    public function list(EventParticipantRepository $eventParticipantRepository): JsonResponse
    {
        $participants = $eventParticipantRepository->findAll();
        $data = [];

        foreach ($participants as $participant) {
            $data[] = [
                'id' => $participant->getId(),
                'user' => $participant->getUser()?->getUsername(),
                'event' => $participant->getEvent()?->getTitle(),
                'joinedAt' => $participant->getJoinedAt()?->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/join', name: 'event_participant_join', methods: ['POST'])]
    public function join(
        Request $request,
        EntityManagerInterface $em,
        EventRepository $eventRepository,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $eventId = $data['event_id'] ?? null;

        if (!$user) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $event = $eventRepository->find($eventId);
        if (!$event) {
            return $this->json(['error' => 'Evento no encontrado'], 404);
        }

        // Comprobar si ya está inscrito
        foreach ($user->getEventParticipations() as $participation) {
            if ($participation->getEvent()->getId() === $event->getId()) {
                return $this->json(['error' => 'Ya inscrito'], 400);
            }
        }

        $participant = new EventParticipant();
        $participant->setUser($user);
        $participant->setEvent($event);
        $participant->setJoinedAt(new \DateTime());

        $em->persist($participant);
        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/leave', name: 'event_participant_leave', methods: ['POST'])]
    public function leave(
        Request $request,
        EntityManagerInterface $em,
        EventParticipantRepository $eventParticipantRepository,
        EventRepository $eventRepository,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $eventId = $data['event_id'] ?? null;

        if (!$user) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $event = $eventRepository->find($eventId);
        if (!$event) {
            return $this->json(['error' => 'Evento no encontrado'], 404);
        }

        $participation = $eventParticipantRepository->findOneBy([
            'user' => $user,
            'event' => $event,
        ]);

        if (!$participation) {
            return $this->json(['error' => 'No inscrito'], 400);
        }

        $em->remove($participation);
        $em->flush();

        return $this->json(['success' => true]);
    }
}
