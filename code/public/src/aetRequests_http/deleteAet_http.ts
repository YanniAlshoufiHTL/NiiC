async function deleteAet_http() {
    const promptEl: HTMLElement | null = document.querySelector(".niic-aet-input-prompt");
    const id = promptEl && promptEl.dataset.id && CheckingHelpers.isStringANumber(promptEl.dataset.id)
        ? +promptEl.dataset.id
        : false;

    if (id === false) {
        // New AET, no need to delete.
        return;
    }

    const response = await fetch(`/api/aets/${id}`, {
        method: "DELETE",
    });


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

