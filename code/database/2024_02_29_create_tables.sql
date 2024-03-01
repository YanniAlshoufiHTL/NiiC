DROP TABLE valiidtoken;
CREATE TABLE niiicuser
(
    username TEXT unique PRIMARY KEY
);

CREATE TABLE calender
(
    id       serial,
    username TEXT,
    FOREIGN KEY (username) REFERENCES niiicuser (username)
);

CREATE TABLE AET
(
    id         serial,
    name       TEXT,
    begin      text,
    enddd      text,
    calenderid  serial,
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
