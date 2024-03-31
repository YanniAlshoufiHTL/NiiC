let modulesLoaded = false;

async function getModulesAndSetInLocalStorage_http() {
    const res = await fetch("/api/modules/");

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
    const interval = setInterval(() => {
        if (modulesLoaded) {
            callback();
            clearInterval(interval);
        }
    }, 100);
}