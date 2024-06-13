async function uninstallModule_http(modId: number) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error(`User ID not found to install module ${modId}.`);
        return;
    }

    const jwt = localStorage.getItem("jwt");

    if(jwt === null) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return -1;
    }

    await fetch(`/api/modules/${modId}/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`,
        }
    });
}