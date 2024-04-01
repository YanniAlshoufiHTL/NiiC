# Refactors 

## http_tests

Code duplication in every file from line 1-4.

## public

### public/index.html:

The namings are OKay and this time I will accept the style being in html because it is not much
and yeah. 

### public/sites

####  sites/calender.html: 

The source script tags are really confusing to be honest (IDK if we can do anything against that)
and the second thing is why do we have CSS code in the HTML file when we have a styles directory where every .html code
have a .css file but the code and the naming seems to be OK.

### public/styles

#### styles/plugin-store.css: 

There is no naming again the css code seems to be solid and yeah we do not care if it is responsive.

### public/src/aetRequests_http

#### src/aetRequests_httpa/deleteAet_http:

Make a function `isStringANumber(str: String): bool`.

#### src/aetRequests_http/updateAet_http:

The fetch seems to be working well but I think you forgot to delete the alerts because why
should a user need an alert for the errors.
Change it to `console.error()`.

### public/src/fe-models:

### public/src/fe-repos

### public/src/login

### public/src/moduleRequests_http

### public/src

#### src/aet-prompt

function promptTimeChange(): This function seems to be fine
                             but there is two `do while` loops that 
                             do the same thing with the same array
                             at two positions but IDK if this is avoidable
                             but everything else seems to be fine.



function submitAetInputPrompt(): The function is too long => more complexity
                                 but no code duplication and I am OK with the namings.

#### src/calendar-dropping:

`els` => `elements`.

#### src/global-update-calendar

The function should be split into more functions

### public/src/webcomps


### code/src/be-models


### code/src/routers

Expand `DatabaseService` and remove duplicate clients. 







