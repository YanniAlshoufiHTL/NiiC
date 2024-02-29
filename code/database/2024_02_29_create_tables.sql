CREATE TABLE USER
(
    username TEXT unique PRIMARY KEY
);

CREATE TABLE CALENDER
(
    id       INTEGER unique PRIMARY KEY,
    username TEXT,
    FOREIGN KEY (username) REFERENCES USER (username)
);

CREATE TABLE AET
(
    id         INTEGER PRIMARY KEY,
    name       TEXT,
    begin      time,
    end        time,
    calenderid INTEGER,
    FOREIGN KEY (calenderid) REFERENCES CALENDER (id)
);

CREATE TABLE BlOCKMODULE
(
    id          INTEGER primary key,
    token       TEXT, -- from valid token
    title       TEXT,
    description TEXT,
    html        TEXT,
    css         TEXT,
    js          TEXT,
    FOREIGN KEY (token) REFERENCES VALIIDTOKEN (token)
);

CREATE TABLE VALIIDTOKEN
(
    token  varchar(40) primary key
);
