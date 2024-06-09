onModulesLoaded(updateStoreModulesUi);

function updateStoreModulesUi() {
    const oldPluginListings = document.querySelectorAll("niic-plugin-listing");

    const pluginListing = document.createElement('niic-plugin-listing');

    for (const oldListing of oldPluginListings) {
        oldListing.remove();
    }

    const installedModulesLoadedTmpInterval = setInterval(() => {
        if (installedModulesLoaded) {
            const storeMods = blockModules
                .filter(mod => !installedBlockModules.some(innerMod => innerMod.id === mod.id))
                .map(mod => {
                    return {
                        id: +mod.id,
                        title: mod.title ? mod.title : "No title",
                        description: mod.description,
                        additionalText: mod.additionalInformation ? mod.additionalInformation : "No additional information",
                        type: mod.type,
                    };
                })

            pluginListing.setAttribute('data-mods', JSON.stringify(storeMods));

            document.querySelector(".niic-plugin-store-content-container")
                ?.appendChild(pluginListing);

            clearInterval(installedModulesLoadedTmpInterval);
        }
    }, 100);
}
