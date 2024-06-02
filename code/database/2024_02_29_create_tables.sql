DROP TABLE installedplugin;
DROP TABLE aet;
DROP TABLE calendar;
DROP TABLE niicuser;

CREATE TABLE niicuser
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(255) UNIQUE NOT NULL,
    email      TEXT                NOT NULL UNIQUE,
    password   TEXT                NOT NULL UNIQUE,
    isloggedin BOOLEAN             NOT NULL
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
    color       VARCHAR(7)   NOT NULL CHECK ( color ~* '^#[a-f0-9]{6}$'
        ) DEFAULT '#23414b',
    calendarid  BIGINT       NOT NULL REFERENCES calendar
);

CREATE TABLE blockmodule
(
    id          SERIAL PRIMARY KEY,
    token       VARCHAR(40)  NOT NULL UNIQUE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    html        TEXT,
    css         TEXT,
    js          TEXT,
    published   bool         NOT NULL default false
);

CREATE TABLE installedplugin
(
    niicuserdid   BIGINT NOT NULL REFERENCES niicuser ON DELETE CASCADE,
    blockmoduleid BIGINT NOT NULL REFERENCES blockmodule ON DELETE CASCADE,
    PRIMARY KEY (niicuserdid, blockmoduleid)
)