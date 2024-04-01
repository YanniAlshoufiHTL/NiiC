DELETE FROM installedplugin
WHERE true;

DELETE FROM blockmodule
WHERE true;

INSERT INTO blockmodule(token, title, description, html, css, js, published)
VALUES ('blm-1-R--W-1',
        'Today''s Quote',
        null,
        '<div></div>',
        'div { width: 100vw; height: 100vh; background-color: #145369; color: white; display: flex; justify-content: center; align-items: center; text-align: center; padding: 20px; box-sizing: border-box; font-family: Arial, sans-serif; font-size: 2rem; }',
        'async function setQuote() { console.log("hi"); const el = document.querySelector(''div''); const res = await fetch(''https://type.fit/api/quotes''); const quotes = await res.json(); const randomIdx = Math.floor(Math.random() * quotes.length); el.innerText = quotes[randomIdx].text } setQuote();',
        true);

INSERT INTO blockmodule(token, title, description, html, css, js, published)
VALUES ('blm-1-R--W-25235',
        'Module 1',
        null,
        '<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, dolor.</div>',
        'div { background-color: blue; font-size: 3rem; font-family: Arial, sans-serif; color: orange; }',
        null,
        true);

INSERT INTO blockmodule(token, title, description, html, css, js, published)
VALUES('blm-1-R--W-12345',
       'Module 2',
       null,
       '<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, dolor.</div>',
       'div { background-color: blue; font-size: 3rem; font-family: Arial, sans-serif; color: orange; }',
       null,
       true);

INSERT INTO blockmodule(token, title, description, html, css, js, published)
VALUES('blm-1-R--W-12346',
       'Module 4',
       null,
       '<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, dolor.</div>',
       'div { background-color: blue; font-size: 3rem; font-family: Arial, sans-serif; color: orange; }',
       null,
       true);