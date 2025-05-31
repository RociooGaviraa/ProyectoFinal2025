<?php

namespace App\Repository;

use App\Entity\EventParticipant;
use App\Entity\Event;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EventParticipant>
 *
 * @method EventParticipant|null find($id, $lockMode = null, $lockVersion = null)
 * @method EventParticipant|null findOneBy(array $criteria, array $orderBy = null)
 * @method EventParticipant[]    findAll()
 * @method EventParticipant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventParticipantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventParticipant::class);
    }

    /**
     * Cuenta cuántos usuarios están inscritos a un evento.
     */
    public function countByEvent(Event $event): int
    {
        return $this->count(['event' => $event]);
    }

    /**
     * Comprueba si un usuario está inscrito a un evento.
     */
    public function isUserJoinedToEvent(User $user, Event $event): bool
    {
        return $this->findOneBy([
            'user' => $user,
            'event' => $event,
        ]) !== null;
    }
}