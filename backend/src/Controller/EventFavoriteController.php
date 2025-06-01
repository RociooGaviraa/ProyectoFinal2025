<?php

namespace App\Controller;

use App\Entity\Event;
use App\Entity\EventFavorite;
use App\Repository\EventFavoriteRepository;
use App\Repository\EventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/favorites')]
class EventFavoriteController extends AbstractController
{
    #[Route('', name: 'get_favorites', methods: ['GET'])]
    public function getFavorites(EventFavoriteRepository $favoriteRepo, #[CurrentUser] ?\App\Entity\User $user = null): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $favorites = $favoriteRepo->findBy(['user' => $user]);
        $events = array_map(function(EventFavorite $fav) {
            $event = $fav->getEvent();
            return [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'category' => $event->getCategory(),
                'capacity' => $event->getCapacity(),
                'image' => $event->getImage()
            ];
        }, $favorites);
        return new JsonResponse($events);
    }

    #[Route('/{eventId}', name: 'add_favorite', methods: ['POST'])]
    public function addFavorite(
        int $eventId,
        EventRepository $eventRepo,
        EventFavoriteRepository $favoriteRepo,
        EntityManagerInterface $em,
        #[CurrentUser] ?\App\Entity\User $user = null
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $event = $eventRepo->find($eventId);
        if (!$event) {
            return new JsonResponse(['error' => 'Evento no encontrado'], 404);
        }
        $existing = $favoriteRepo->findOneBy(['user' => $user, 'event' => $event]);
        if ($existing) {
            return new JsonResponse(['message' => 'Ya es favorito']);
        }
        $favorite = new EventFavorite();
        $favorite->setUser($user);
        $favorite->setEvent($event);
        $em->persist($favorite);
        $em->flush();
        return new JsonResponse(['message' => 'Añadido a favoritos']);
    }

    #[Route('/{eventId}', name: 'remove_favorite', methods: ['DELETE'])]
    public function removeFavorite(
        int $eventId,
        EventRepository $eventRepo,
        EventFavoriteRepository $favoriteRepo,
        EntityManagerInterface $em,
        #[CurrentUser] ?\App\Entity\User $user = null
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
        $event = $eventRepo->find($eventId);
        if (!$event) {
            return new JsonResponse(['error' => 'Evento no encontrado'], 404);
        }
        $favorite = $favoriteRepo->findOneBy(['user' => $user, 'event' => $event]);
        if (!$favorite) {
            return new JsonResponse(['message' => 'No estaba en favoritos']);
        }
        $em->remove($favorite);
        $em->flush();
        return new JsonResponse(['message' => 'Eliminado de favoritos']);
    }
} 