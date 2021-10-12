CREATE TABLE IF NOT EXISTS paintings (
                                         id int NOT NULL AUTO_INCREMENT,
                                         name varchar(256) NOT NULL,
                                         description text NOT NULL,
                                         yearOfCreation int,
                                         authorId int,
                                         PRIMARY KEY (id),
                                        foreign key (authorId) references authors (id)
) DEFAULT CHARSET=utf8;




