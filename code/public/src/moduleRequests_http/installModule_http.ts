async function installModule_http(modId: number) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error(`User ID not found to install module ${modId}.`);
        return;
    }

    await fetch(`/api/modules/${modId}/${userId}`, {
        method: "PUT"
    });
}