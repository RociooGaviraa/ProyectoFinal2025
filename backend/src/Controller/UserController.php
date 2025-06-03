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
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
            'avatar' => $user->getAvatar(),
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

    #[Route('/user/profile', name: 'update_user_profile', methods: ['PUT', 'POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function updateProfile(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        // Si es multipart/form-data, usa $request->files y $request->request
        $data = $request->request->all();

        if (isset($data['name'])) $user->setName($data['name']);
        if (isset($data['surname'])) $user->setSurname($data['surname']);
        if (isset($data['email'])) $user->setEmail($data['email']);
        if (isset($data['username'])) $user->setUsername($data['username']);
        if (isset($data['birthDate'])) $user->setBirthDate(new \DateTime($data['birthDate']));

        $avatarUrl = $request->request->get('avatar');
        error_log('Avatar recibido: ' . $avatarUrl);
        if ($avatarUrl) {
            $user->setAvatar($avatarUrl);
        }

        $em->flush();

        return $this->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'surname' => $user->getSurname(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles(),
                'avatar' => $user->getAvatar(),
            ]
        ]);
    }

    #[Route('/me', name: 'get_my_profile', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getMyProfile(): JsonResponse
    {
        $user = $this->getUser();
        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'surname' => $user->getSurname(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles(),
                'avatar' => $user->getAvatar(),
            ]
        ]);
    }
}
