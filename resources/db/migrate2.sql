DROP TABLE IF EXISTS `note`;

create table note(
      `id` INT NOT NULL AUTO_INCREMENT,
      `title` VARCHAR(256) NOT NULL,
      `text` TEXT NOT NULL,
      `userId` int(11) NOT NULL,
      `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;