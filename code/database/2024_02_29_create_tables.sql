
CREATE TABLE niicuser --- mistake with spelling niicuser, tablename should be in lowercase because sql syntax
(
    id       SERIAL PRIMARY KEY,
    username TEXT UNIQUE
);

CREATE TABLE calendar ---had mistake with spelling calendar
(
    id       SERIAL PRIMARY KEY ,
    username VARCHAR(255),
    FOREIGN KEY (username) REFERENCES niicuser (username)
);

CREATE TABLE aet
(
    id         SERIAL PRIMARY KEY , -- ids should be primary keys because it is a constraint attribute
    name       VARCHAR(255),
    tsbegin    TIMESTAMP,        -- timestamp because tsbegin is the time when the aet begins
    tsend      TIMESTAMP,        -- the same goes for here tsend is the time when the aet ends
    calenderid  SERIAL,
    FOREIGN KEY (calenderid) REFERENCES calendar(id)
);

CREATE TABLE blockmodule
(
    id          SERIAL PRIMARY KEY, --Serial because it generates ids automatically(incrementing)
    token       VARCHAR(40) UNIQUE, -- two blockmodule shouldn't habe the same token
    title       VARCHAR(255),
    description TEXT,
    html        TEXT,
    css         TEXT,
    js          TEXT
);

--We do not need the validtoken table because the token is supposed to be unique
-- so it would be useless to check it with an extra tble