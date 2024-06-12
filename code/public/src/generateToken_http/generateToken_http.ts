async function generateToken_http() {
    const pluginTypeInput: HTMLInputElement | null = document.querySelector(".selected-radio");
    const oldTokenInput: HTMLInputElement | null = document.querySelector(".niic-profile-token-generation-override-token-old-token-input");

    const users = getUsersFromUi();

    if (pluginTypeInput?.value !== "blm") {
        alert("At the moment, only block moduls are allowed.");
        return;
    }

    const userId = localStorage.getItem("userId");

    if (userId === null) {
        alert('You are not logged in correctly!');
        logoutUser();
        return;
    }

    if (/\d+/.test(userId) === false) {
        alert("Oops, something went wrong.");
        console.error(`User ID: ${userId}`);
        return;
    }

    const oldTokenValue = oldTokenInput !== null && oldTokenInput.disabled === false
        ? oldTokenInput.value
        : null;

    const response = await fetch(`/api/tokens/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body:
            JSON.stringify({
                "type": pluginTypeInput?.value,
                "userId": +userId,
                "write": users.filter(x => x.write === true).map(x => x.username),
                "read": users.filter(x => x.read === true).map(x => x.username),
                "oldToken": oldTokenValue,
            })
    });

    const generatedTokenInput: HTMLInputElement | null = document.querySelector(".niic-profile-token-generation-generated-token-input");
    generatedTokenInput!.value = await response.text();

    if (response.status !== 200 && response.status !== 400 && response.status !== 201) {
        alert(response.status);
        alert(await response.text());
        return;
    }
}

function getUsersFromUi(): { username: string, read: boolean, write: boolean }[] {
    const userInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(".niic-profile-token-generation-read-and-write-el-checkbox");

    const users: { username: string, read: boolean, write: boolean }[] = [];
    for (const userInput of userInputs) {
        const datasetUsername = userInput.dataset.username;
        const datasetType = userInput.dataset.type;

        if (datasetUsername === undefined || datasetType !== "read" && datasetType !== "write") {
            console.error(`Could not read username and type from dataset. Dataset: ${userInput.dataset}`)
            continue;
        }

        const idx = users.findIndex(x => x.username === datasetUsername);

        if (idx === -1) {
            users.push({
                username: datasetUsername,
                write: datasetType === "write" ? userInput.checked : false,
                read: datasetType === "read" ? userInput.checked : false
            });
            continue;
        }

        if (datasetType === "write") {
            users[idx].write = userInput.checked;
        }

        if (datasetType === "read") {
            users[idx].read = userInput.checked;
        }
    }

    return users;
}