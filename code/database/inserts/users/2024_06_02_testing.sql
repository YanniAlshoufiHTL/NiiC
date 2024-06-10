DELETE FROM niicuser
WHERE true;

INSERT INTO niicuser(username, password, isloggedin)
VALUES ('yanni', 'yanni1234', false);

INSERT INTO niicuser(username, password, isloggedin)
VALUES ('gugi', 'gugi1234', false);

INSERT INTO niicuser(username, password, isloggedin)
VALUES ('ok', 'lawand1234', false);
