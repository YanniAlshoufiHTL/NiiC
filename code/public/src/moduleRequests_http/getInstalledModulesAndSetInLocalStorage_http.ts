let installedModulesLoaded = false;

async function getInstalledModulesAndSetInLocalStorage_http(userId: number) {
    const jwt = localStorage.getItem("jwt");

    if(jwt === null) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return;
    }

    const res = await fetch(`/api/modules/${userId}`, {
        method: "GET",
            headers: {
            "Authorization": `Bearer ${jwt}`,
        },
    });

    if (res.status === 401) {
        alert("You are not logged in.");
        window.open("/", "_self");
        return;
    }

    if (res.status !== 200) {
        console.error("Failed to fetch modules");
        return;
    }

    const mods: NiicBlockModule[] = await res.json();
    localStorage.setItem("installedBlockModules", JSON.stringify(mods));
    setInstalledBlockModules()

    installedModulesLoaded = true;
}

function onInstalledModulesLoaded(callback: () => void) {
    const intervalForInstalledModules = setInterval(() => {
        if (installedModulesLoaded) {
            callback();
            clearInterval(intervalForInstalledModules);
        }
    }, 100);
}