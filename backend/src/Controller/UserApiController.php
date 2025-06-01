<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api')]
class UserApiController extends AbstractController
{
    #[Route('/me', name: 'api_user_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'message' => 'No authenticated user found'
            ], 401);
        }

        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'name' => $user->getName(),
                'surname' => $user->getSurname(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    #[Route('/me', name: 'api_user_update', methods: ['PUT', 'PATCH'])]
    public function updateMe(Request $request, #[CurrentUser] ?User $user, EntityManagerInterface $em): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'No authenticated user found'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['username'])) $user->setUsername($data['username']);
        if (isset($data['email'])) $user->setEmail($data['email']);

        $em->flush();

        return $this->json(['message' => 'Perfil actualizado correctamente']);
    }
} 