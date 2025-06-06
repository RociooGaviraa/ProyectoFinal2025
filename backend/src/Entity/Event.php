<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[ORM\Column(length: 255)]
    private ?string $category = null;

    #[ORM\Column]
    private ?int $capacity = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $state = null;

    #[ORM\Column(type: 'boolean', nullable: true)]
    private ?bool $subcategory = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2, nullable: true)]
    private ?string $price = null;

    /**
     * @ORM\ManyToMany(targetEntity=User::class)
     * @ORM\JoinTable(name="event_attendees")
     */
    private $attendees;

    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventParticipant::class)]
    private Collection $eventParticipants;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE', name: 'organizer_id', referencedColumnName: 'id')]
    private ?User $organizer = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $stripeProductId = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $stripePriceId = null;

    #[ORM\Column(type: "float", nullable: true)]
    private ?float $lat = null;

    #[ORM\Column(type: "float", nullable: true)]
    private ?float $lng = null;

    public function __construct()
    {
        $this->attendees = new ArrayCollection();
        $this->eventParticipants = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): static
    {
        $this->capacity = $capacity;
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;
        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(?string $state): self
    {
        $this->state = $state;
        return $this;
    }

    public function getSubcategory(): ?bool
    {
        return $this->subcategory;
    }

    public function setSubcategory(?bool $subcategory): self
    {
        $this->subcategory = $subcategory;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): self
    {
        $this->price = $price;
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getAttendees(): Collection
    {
        if ($this->attendees === null) {
            $this->attendees = new ArrayCollection();
        }
        return $this->attendees;
    }

    public function addAttendee(User $user): self
    {
        if (!$this->attendees->contains($user)) {
            $this->attendees[] = $user;
        }
        return $this;
    }

    public function removeAttendee(User $user): self
    {
        $this->attendees->removeElement($user);
        return $this;
    }

    public function getOrganizer(): ?User
    {
        return $this->organizer;
    }

    public function setOrganizer(?User $organizer): self
    {
        $this->organizer = $organizer;
        return $this;
    }

    public function getStripeProductId(): ?string { return $this->stripeProductId; }
    public function setStripeProductId(?string $id): self { $this->stripeProductId = $id; return $this; }

    public function getStripePriceId(): ?string { return $this->stripePriceId; }
    public function setStripePriceId(?string $id): self { $this->stripePriceId = $id; return $this; }

    public function getLat(): ?float { return $this->lat; }
    public function setLat(?float $lat): self { $this->lat = $lat; return $this; }
    public function getLng(): ?float { return $this->lng; }
    public function setLng(?float $lng): self { $this->lng = $lng; return $this; }
}
