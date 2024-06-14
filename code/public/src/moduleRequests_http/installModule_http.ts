async function installModule_http(modId: number) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error(`User ID not found to install module ${modId}.`);
        return;
    }

    const jwt = localStorage.getItem("jwt");

    if(jwt === null) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return;
    }

    const res = await fetch(`/api/modules/${modId}/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${jwt}`,
        }
    });

    if (res.status === 401) {
        alert("You are not logged in.");
        window.open("/", "_self");
        return;
    }
}