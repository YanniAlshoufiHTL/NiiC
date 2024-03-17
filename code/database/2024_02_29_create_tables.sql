CREATE TABLE niicuser
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE calendar
(
    id         SERIAL PRIMARY KEY,
    niicuserid BIGINT NOT NULL REFERENCES niicuser
);

CREATE TABLE aet
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    date        DATE         NOT NULL,
    type        varchar(40)  NOT NULL CHECK ( type IN ('appointment', 'event', 'task') ),
    timebegin   NUMERIC      NOT NULL CHECK ( timebegin >= 0 AND timebegin <= 24 AND timebegin <= timeend ),
    timeend     NUMERIC      NOT NULL CHECK ( timeend >= 0 AND timeend <= 24 AND timebegin <= timeend ),
    color       VARCHAR(7)   NOT NULL CHECK ( color ~* '^#[a-f0-9]{6}$' ) DEFAULT '#23414b',
    calenderid  BIGINT       NOT NULL REFERENCES calendar
);

CREATE TABLE blockmodule
(
    id          SERIAL PRIMARY KEY,
    token       VARCHAR(40)  NOT NULL UNIQUE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    html        TEXT,
    css         TEXT,
    js          TEXT
);

