async function generateToken_http() {

    const pluginTypeInput: HTMLInputElement | null = document.querySelector(".selected-radio");
    const oldTokenInput: HTMLInputElement | null = document.querySelector(".niic-profile-token-generation-override-token-old-token-input");
    const liElements = document.querySelectorAll(".niic-profile-token-generation-read-and-write-access-rec-users-list-item");

    let isAtHeader = true;
    for (const el of liElements) {
        if (isAtHeader) {
            isAtHeader = false;
            continue;
        }

        const children = el.children;
        const name = children[0].innerHTML;
        const isWriteChecked = (children[1] as HTMLInputElement).checked;
        const isReadChecked = (children[2] as HTMLInputElement).checked;
        // TODO finish
    }

    if (pluginTypeInput?.value !== "blm") {
        alert("At the moment, only block moduls are allowed.");
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
                "userId": 1,
                "write": [],
                "read": [],
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