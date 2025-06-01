<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250601182837 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7B03A8386
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event CHANGE organizer_id organizer_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7876C4DDA FOREIGN KEY (organizer_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event RENAME INDEX idx_3bae0aa7b03a8386 TO IDX_3BAE0AA7876C4DDA
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7876C4DDA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event CHANGE organizer_id organizer_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7B03A8386 FOREIGN KEY (organizer_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE SET NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE event RENAME INDEX idx_3bae0aa7876c4dda TO IDX_3BAE0AA7B03A8386
        SQL);
    }
}
