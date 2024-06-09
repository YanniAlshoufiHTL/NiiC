onInstalledModulesLoaded(updateInstalledModulesUi);

function updateInstalledModulesUi() {
    const oldPluginListings = document.querySelectorAll("niic-plugin-listing");

    const pluginListing = document.createElement('niic-plugin-listing');

    for (const oldListing of oldPluginListings) {
        oldListing.remove();
    }

    const storeMods = installedBlockModules
        .map(mod => {
            return {
                id: mod.id,
                title: mod.title ? mod.title : "No title",
                description: mod.description ? mod.description : "No description",
                additionalText: [
                    mod.html ? "HTML" : null,
                    mod.css ? "CSS" : null,
                    mod.js ? "JS" : null,
                ]
                    .filter(text => text !== null)
                    .join(" + "),
                type: mod.type,
            };
        })

    pluginListing.setAttribute('data-mods', JSON.stringify(storeMods));
    pluginListing.setAttribute('data-mode', 'uninstall');

    document
        .querySelector(".niic-plugin-store-content-container")
        ?.appendChild(pluginListing);
}
