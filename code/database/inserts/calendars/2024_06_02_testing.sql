DELETE FROM calendar
WHERE true;

INSERT INTO calendar(niicuserid)
VALUES ((SELECT id
         FROM niicuser
         WHERE username = 'yanni'));

INSERT INTO calendar(niicuserid)
VALUES ((SELECT id
         FROM niicuser
         WHERE username = 'gugi'));

INSERT INTO calendar(niicuserid)
VALUES ((SELECT id
        FROM niicuser
        WHERE username = 'ok'));