let installedBlockModules: NiicBlockModule[] = [];

function setInstalledBlockModules() {
    installedBlockModules = JSON.parse(localStorage.getItem("installedBlockModules") ?? "[]")
        .map((x: NiicBlockModule) => {
            const tmp: NiicBlockModule = {
                ...x,
                id: +x.id,
            };
            return tmp;
        });
}

getInstalledModulesAndSetInLocalStorage_http(+(localStorage.getItem("userId") ?? "-1"))
    .then(_ => {
        setInstalledBlockModules();
    });