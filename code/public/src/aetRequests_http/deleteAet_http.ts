async function deleteAet_http() {
    const promptEl: HTMLElement | null = document.querySelector(".niic-aet-input-prompt");
    const id = promptEl && promptEl.dataset.id && CheckingHelpers.isStringANumber(promptEl.dataset.id)
        ? +promptEl.dataset.id
        : false;

    if (id === false) {
        // New AET, no need to delete.
        return;
    }


    const jwt = localStorage.getItem("jwt");

    if(jwt === null) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return -1;
    }

    const response = await fetch(`/api/aets/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`,
        },
    });

    if (response.status === 401) {
        alert("Not authorized.");
        logoutUser();
        return -1;
    }


    if (response.status !== 204) {
        alert("We apologize, AET could not be deleted, response code:" + response.status);
    }

    const idx = aets.findIndex(aet => aet.id === id);
    if (idx !== -1) {
        aets.splice(idx, 1);
        localStorage.setItem("aets", JSON.stringify(aets));
    }
    globalUpdateCalendar();


    hideAetInputPrompt();
}

