let blockModules: NiicPublishedModule[] = [];

function setBlockModules() {
    blockModules = JSON.parse(localStorage.getItem("blockModules") ?? "[]")
        .map((x: NiicPublishedModule) => {
            const tmp: NiicPublishedModule = {
                id: +x.id,
                title: x.title,
                description: x.description,
                type: x.type,
                additionalInformation: x.additionalInformation,
            };
            return tmp;
        });
}

getModulesAndSetInLocalStorage_http()
    .then(_ => {
        setBlockModules();
    });