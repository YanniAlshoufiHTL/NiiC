DELETE FROM niicuser
WHERE true;

INSERT INTO niicuser(username, email, password, isloggedin)
VALUES ('yanni', 'yanni@outlook.at', 'yanni1234', false);

INSERT INTO niicuser(username, email, password, isloggedin)
VALUES ('gugi', 'clemens.gugi.von.habsburg.aus.tschechien@gmail.com', 'gugi1234', false);

INSERT INTO niicuser(username, email, password, isloggedin)
VALUES ('ok', 'ok@ok.ok', 'lawand1234', false);
