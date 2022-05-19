CREATE TABLE person(
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    date_created DATE NOT NULL,
    date_updated DATE
);

CREATE TABLE groups(
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    parent_group INT DEFAULT NULL,
    date_created DATE NOT NULL,
    date_updated DATE
 );

CREATE TABLE group_members(
    group_id INT NOT NULL,
    person_id INT NOT NULL,
    data_added DATE NOT NULL,
    check_unique VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY(group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY(person_id) REFERENCES person(person_id) ON DELETE CASCADE
 );

  CREATE TABLE users(
    email VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
 );