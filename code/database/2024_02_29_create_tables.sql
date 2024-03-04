
CREATE TABLE niicuser
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE calendar
(
    id       SERIAL PRIMARY KEY,
    usernameid BIGINT NOT NULL REFERENCES niicuser
);

CREATE TABLE aet
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    date        DATE         NOT NULL,
    type        varchar(40)  NOT NULL CHECK ( type = 'appointment' OR type = 'event' OR type = 'task' ),
    tsbegin     TIMESTAMP    NOT NULL,
    tsend       TIMESTAMP    NOT NULL,
    color       VARCHAR(7) NOT NULL CHECK (color ~* '^#[a-f0-9]{6}$') DEFAULT '#23414b',
    calenderid  BIGINT REFERENCES calendar
);

CREATE TABLE blockmodule
(
    id          SERIAL PRIMARY KEY,
    token       VARCHAR(40) UNIQUE NOT NULL ,
    title       VARCHAR(255) NOT NULL ,
    description TEXT,
    html        TEXT,
    css         TEXT,
    js          TEXT
);

