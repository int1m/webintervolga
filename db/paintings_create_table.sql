CREATE TABLE IF NOT EXISTS paintings (
                                         id int NOT NULL AUTO_INCREMENT,
                                         name varchar(256) NOT NULL,
                                         description text NOT NULL,
                                         yearOfCreation int,
                                         authorId int,
                                         PRIMARY KEY (id),
                                        foreign key (authorId) references authors (id)
) DEFAULT CHARSET=utf8;



CREATE TABLE IF NOT EXISTS users
(
    id             int          NOT NULL AUTO_INCREMENT,
    email           varchar(256) NOT NULL,
    surname           varchar(256) NOT NULL,
    name           varchar(256) NOT NULL,
    patronymic           varchar(256),
    vk           varchar(256) NOT NULL,
    date           varchar(256) NOT NULL,
    sex           boolean NOT NULL,
    password           varchar(256) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARSET = utf8;




