async function generateToken_http() {

    const pluginType: HTMLInputElement | null = document.querySelector(".niic-profile-token-generation-kindOfPlugin-form");

    const write: HTMLInputElement | null = document.querySelector("");
    const read: HTMLInputElement | null = document.querySelector("");

    const checkbox : HTMLInputElement | null = <HTMLInputElement> document.getElementById("overrideToken");
    if(checkbox.checked) {
        const oldToken: HTMLInputElement | null = document.querySelector(".niic-profile-token-generation-OverrideToken-OldToken-input");
    }

    const response = await fetch(`/api/tokens/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body:
            JSON.stringify({
                "type": "blm",
                "write": [5, 2, 10],
                "read": [1, 59, 100],
                "oldToken": "blm--R--W-12345"
            })
    });

    if(response.status !== 204){
        alert(response.status);
        alert(await response.text());
        return;
    }
}