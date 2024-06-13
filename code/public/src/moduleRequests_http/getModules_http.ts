let modulesLoaded = false;

async function getModulesAndSetInLocalStorage_http() {

    const jwt = localStorage.getItem("jwt");

    if(jwt === null) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return;
    }

    const res = await fetch("/api/modules/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`,
        },
    });

    if (res.status !== 200) {
        console.error("Failed to fetch modules");
        return;
    }

    const mods: NiicBlockModule[] = await res.json();
    localStorage.setItem("blockModules", JSON.stringify(mods));
    setBlockModules()

    modulesLoaded = true;
}

function onModulesLoaded(callback: () => void) {
    const intervalForPublishedModules = setInterval(() => {
        if (modulesLoaded) {
            callback();
            clearInterval(intervalForPublishedModules);
        }
    }, 100);
}