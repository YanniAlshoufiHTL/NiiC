function alterOldTokenInput() {
    const inputEl = document.querySelector(".niic-profile-token-generation-override-token-old-token-input") as HTMLInputElement | undefined;

    if (inputEl === undefined) {
        return;
    }

    inputEl.disabled = !inputEl.disabled;
}

async function addUserPrompt() {
    const username = prompt("Please enter the username of the user you want to add to the list.", "here");

    if(!username){
        return;
    }

    const userNameEls: NodeListOf<HTMLParagraphElement> =
        document.querySelectorAll(".niic-profile-token-generation-read-and-write-el-username");

    const usernames = [...userNameEls].map(x => x.innerText);

    if (usernames.includes(username)) {
        alert("Please don't reenter the same username twice!");
        return;
    }

    const res = await fetch(`/api/users/exists/${username}`);

    if (res.status !== 200) {
        alert("Sorry, something went wrong, try again later!");
        console.error("Something went wrong!");
        console.error(`Result text: ${await res.text()}`);
        return;
    }

    const resultText = await res.text();

    if (resultText !== "true" && resultText !== "false") {
        alert("Sorry, something went wrong, try again later!");
        console.error("Result text isn't a valid boolean!");
        console.error(`Result text: ${resultText}`);
        return;
    }

    const doesUserExist = resultText === "true";

    if (!doesUserExist) {
        alert("Hmm, looks like the user you are looking for does not exist. Are you sure you entered the name right?");
        console.info(`User does not exist. Username: ${username}`);
        return;
    }

    const ul = document.querySelector(".niic-profile-token-generation-read-and-write-access-rec-users-list") as HTMLUListElement;
    ul.innerHTML += `
            <li class="niic-profile-token-generation-read-and-write-access-rec-users-list-item">
                <p class="niic-profile-token-generation-read-and-write-el-username">${username}</p>
                <input type="checkbox" data-username="${username}" data-type="write" class="niic-profile-token-generation-read-and-write-el-checkbox">
                <input type="checkbox" data-username="${username}" data-type="read" class="niic-profile-token-generation-read-and-write-el-checkbox">
            </li>
        `;
}

const radios = document.querySelectorAll("input");
for (const radio of radios) {
    radio.addEventListener("click", () => {
        for (const r of radios) {
            if (r.checked === true) {
                r.classList.add("selected-radio");
            } else {
                r.classList.remove("selected-radio");
            }
        }
    });
}

async function copyTokenInputValue() {
    const inputElement = document.querySelector(".niic-profile-token-generation-generated-token-input") as HTMLInputElement;
    await navigator.clipboard.writeText(inputElement?.value);
    alert("Copied successfully! :)");
}
