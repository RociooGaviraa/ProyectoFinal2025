<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250511161106 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD category VARCHAR(255) NOT NULL, DROP created_at, DROP updated_at, CHANGE capacity capacity INT NOT NULL, CHANGE status status VARCHAR(255) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_IDENTIFIER_USERNAME ON user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP name, DROP surname, DROP birth_date, DROP profile_picture, DROP created_at, CHANGE username username VARCHAR(255) NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE event ADD created_at DATETIME NOT NULL, ADD updated_at DATETIME DEFAULT NULL, DROP category, CHANGE capacity capacity INT DEFAULT NULL, CHANGE status status VARCHAR(50) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD name VARCHAR(100) NOT NULL, ADD surname VARCHAR(100) NOT NULL, ADD birth_date DATE DEFAULT NULL, ADD profile_picture VARCHAR(255) DEFAULT NULL, ADD created_at DATETIME NOT NULL, CHANGE username username VARCHAR(180) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME ON user (username)
        SQL);
    }
}
