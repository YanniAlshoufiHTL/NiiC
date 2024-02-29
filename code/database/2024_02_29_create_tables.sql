CREATE TABLE USER
(
    username TEXT unique PRIMARY KEY
) STRICT;

CREATE TABLE CALENDER
(
    id       INTEGER unique PRIMARY KEY,
    username TEXT,
    FOREIGN KEY (username) REFERENCES USER (username)
) STRICT;

CREATE TABLE AET
(
    id         INTEGER PRIMARY KEY,
    name       TEXT,
    begin      DATETIME,
    end        DATETIME,
    calenderid INTEGER,
    FOREIGN KEY (calenderid) REFERENCES CALENDER (id)
) STRICT;

CREATE TABLE BlOCKMODULE
(
    id          INTEGER primary key,
    token       TEXT, -- from valid token
    title       TEXT,
    description TEXT,
    html        TEXT,
    css         TEXT,
    js          TEXT,
    FOREIGN KEY (token) REFERENCES validToken (token)

);

CREATE TABLE VALIIDTOKEN
(
    token varchar(20) primary key
) ;

INSERT INTO USER (username)
VALUES ('Yanni'),
       ('Clemens'),
       ('Lawand'),
       ('t1'),
       ('t2'),
       ('t3');
INSERT INTO CALENDER (id, username)
VALUES (1, 'Yanni'),
       (2, 'Clemens'),
       (3, 'Lawand'),
       (4, 't1'),
       (5, 't2'),
       (6, 't3');