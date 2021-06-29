create table users(
      `id` INT NOT NULL AUTO_INCREMENT,
      `name` VARCHAR(100) UNIQUE NOT NULL,
      `email` VARCHAR(100) UNIQUE NOT NULL,
      `password`  VARCHAR(256) NOT NULL,
      PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;