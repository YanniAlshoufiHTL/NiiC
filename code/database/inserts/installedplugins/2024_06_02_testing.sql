DELETE FROM installedplugin
WHERE true;

INSERT INTO installedplugin(niicuserdid, blockmoduleid)
VALUES((SELECT id FROM niicuser WHERE username = 'yanni'), 83);

INSERT INTO installedplugin(niicuserdid, blockmoduleid)
VALUES((SELECT id FROM niicuser WHERE username = 'yanni'), 85);
