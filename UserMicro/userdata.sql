CREATE DATABASE usermicro;

create table users
(
    is_admin boolean,
    id       bigserial
        primary key,
    email    varchar(255),
    name     varchar(255),
    password varchar(255)
);

alter table users
    owner to postgres;

