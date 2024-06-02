let installedModulesLoaded = false;

async function getInstalledModulesAndSetInLocalStorage_http(userId: number) {
    console.log(userId)
    const res = await fetch(`/api/modules/${userId}`);

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