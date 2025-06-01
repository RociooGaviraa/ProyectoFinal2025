<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true, nullable: false)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $surname = null;

    #[ORM\Column(type: "date", nullable: false)]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $profile = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(nullable: false)]
    private ?string $password = null;

    #[ORM\OneToMany(mappedBy: 'organizer', targetEntity: Event::class)]
    private Collection $organizedEvents;

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'participants')]
    private Collection $participatingEvents;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: EventParticipant::class)]
    private Collection $eventParticipations;

    public function __construct()
    {
        $this->organizedEvents = new ArrayCollection();
        $this->participatingEvents = new ArrayCollection();
        $this->eventParticipations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): static
    {
        $this->surname = $surname;
        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(?\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getProfile(): ?string
    {
        return $this->profile;
    }

    public function setProfile(?string $profile): static
    {
        $this->profile = $profile;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getOrganizedEvents(): Collection
    {
        return $this->organizedEvents;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getParticipatingEvents(): Collection
    {
        return $this->participatingEvents;
    }

    public function addParticipatingEvent(Event $event): static
    {
        if (!$this->participatingEvents->contains($event)) {
            $this->participatingEvents->add($event);
        }
        return $this;
    }

    public function removeParticipatingEvent(Event $event): static
    {
        $this->participatingEvents->removeElement($event);
        return $this;
    }

    /**
     * @return Collection<int, EventParticipant>
     */
    public function getEventParticipations(): Collection
    {
        return $this->eventParticipations;
    }
}
