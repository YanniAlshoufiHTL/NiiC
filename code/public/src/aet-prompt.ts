function dateToInputStr(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}


function showAetInputPrompt() {
    const aetInputPromptBg = document.querySelector(".niic-aet-input-prompt-container");

    if (!aetInputPromptBg) {
        console.error("Could not show prompt container because element doesn't seem to exist.")
        return;
    }

    aetInputPromptBg.classList.remove("hidden");

    const aetInputPrompt = aetInputPromptBg.querySelector(".niic-aet-input-prompt");

    if (!aetInputPrompt) {
        console.error("Could not show prompt because element doesn't seem to exist.")
        return;
    }

    const dateEl: HTMLInputElement | null = aetInputPrompt.querySelector(".niic-aet-input-date")

    if (dateEl && dateEl.value.trim() === "") {
        dateEl.value = dateToInputStr(new Date(Date.now()));
    }
}


function hideAetInputPrompt() {
    const aetInputPromptBg = document.querySelector(".niic-aet-input-prompt-container");

    if (!aetInputPromptBg) {
        console.error("Could not show prompt container because element doesn't seem to exist.")
        return;
    }

    aetInputPromptBg.classList.add("hidden");
}


function promptTimeChange() {
    const btn = document.querySelector(".niic-aet-btn-time");

    if (btn === null) {
        console.error("Could not get .niic-aet-btn-time")
        return;
    }

    const times = btn
            .textContent
            ?.split(" ")
            .filter(x => x.length === 5)
        ?? ['00:00', '00:00'];

    let from;
    do {
        from = prompt("From:", times[0]) ?? "";
    } while (!(/^(((0[0-9])|(1[0-9])|(2[0-3])):[0-5][0-9])|(24:00)$/.test(from)));

    let to;
    do {
        to = prompt("To:", times[1]) ?? "";
    } while (!(/^(((0[0-9])|(1[0-9])|(2[0-3])):[0-5][0-9])|(24:00)$/.test(to)));

    const splitFrom = from.split(":");
    const splitTo = to.split(":");

    const stampFrom = +splitFrom[0] * 60 + +splitFrom[1];
    const stampTo = +splitTo[0] * 60 + +splitTo[1];

    if (stampFrom <= stampTo) {
        btn.textContent = `${from} – ${to}`;
    } else {
        promptTimeChange();
    }
}


function showAetEditPrompt(id: number) {
    const aetInputPromptBg = document.querySelector(".niic-aet-input-prompt-container");

    if (!aetInputPromptBg) {
        console.error("Could not show prompt container because element doesn't seem to exist.");
        return;
    }

    aetInputPromptBg.classList.remove("hidden");

    const aetInputPrompt: HTMLElement | null = aetInputPromptBg.querySelector(".niic-aet-input-prompt");

    if (!aetInputPrompt) {
        console.error("Could not show prompt because element doesn't seem to exist.");
        return;
    }

    const idx = aets.findIndex(x => x.id === id);

    if (idx === -1) {
        console.error("Could not edit AET because the ID provided was not in AET array.");
        return;
    }

    aetInputPrompt.dataset.id = id.toString();

    const aet = aets[idx];

    const titleEl: HTMLInputElement | null = document.querySelector(".niic-aet-input-prompt-title");
    titleEl!!.value = aet.title;

    const descriptionEl: HTMLTextAreaElement | null =
        document.querySelector(".niic-aet-input-prompt-description-textarea");
    descriptionEl!!.textContent = aet.description;

    const timeBtnEl: HTMLButtonElement | null = document.querySelector(".niic-aet-btn-time");
    const timeToStr = (time: number) =>
        `${(Math.floor(time).toString()).padStart(2, "0")}:${(((time - Math.floor(time)) * 60)).toString().padStart(2, "0")}`;
    timeBtnEl!!.innerText = `${timeToStr(aet.startTime)} - ${timeToStr(aet.endTime)}`;

    const dateEl: HTMLInputElement | null = document.querySelector(".niic-aet-input-date");
    dateEl!!.value = dateToInputStr(aet.date);

    const typeEl: HTMLSelectElement | null = document.querySelector(".niic-aet-type-select");
    typeEl!!.value = aet.type;

    const colorEl: HTMLInputElement | null = document.querySelector(".niic-color-btn");
    let color = aet.color;
    if (color.length === 4) { // Changing #ab3 to #aabb33 so HTML understands it
        color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    }
    colorEl!!.value = color;
}

async function submitAetInputPrompt(ev: SubmitEvent) {
    ev.preventDefault();

    const promptEl: HTMLElement | null = document.querySelector(".niic-aet-input-prompt");
    const id = promptEl && promptEl.dataset.id && /^\d+$/.test(promptEl.dataset.id)
        ? +promptEl.dataset.id
        : false;

    const title = (document.querySelector(".niic-aet-input-prompt-title") as HTMLInputElement | null)?.value;
    const description = document.querySelector(".niic-aet-input-prompt-description-textarea")?.textContent;
    const date = (document.querySelector(".niic-aet-input-date") as HTMLInputElement | null)?.valueAsDate;
    const timeStr = document.querySelector(".niic-aet-btn-time")?.textContent?.trim();
    const type: "appointment" | "event" | "task" | string | undefined =
        (document.querySelector(".niic-aet-type-select") as HTMLSelectElement | null)?.value;
    const color = (document.querySelector(".niic-color-btn") as HTMLInputElement | null)?.value;

    if (!title || description === undefined || description === null || !date || !timeStr || !type || !color ||
        type !== "appointment" && type !== "event" && type !== "task") {

        console.table([
            ["title", "description", "date", "timeStr", "type", "color"],
            [title, description, date, timeStr, type, color]
        ]);

        alert("Please fill all fields!")
        return;
    }

    const timesPattern = /^\d\d:\d\d . \d\d:\d\d$/;
    const timePattern = /^(((0[0-9])|(1[0-9])|(2[0-3])):[0-5][0-9])|24:00$/;

    if (!timesPattern.test(timeStr)) {
        alert("The times string provided is not correctly formatted!");
        return;
    }

    const times = timeStr.split(" ").filter(x => x.length === 5);
    const startTimeStr = times[0];
    const endTimeStr = times[1];

    if (!timePattern.test(startTimeStr) || !timePattern.test(endTimeStr)) {
        alert("The separate times provided are not correctly formatted!");
        return;
    }

    if (startTimeStr > endTimeStr) {
        alert("The start time cannot be greater than the end time!");
        return;
    }

    const splitStartTime = startTimeStr.split(":");
    const splitEndTime = endTimeStr.split(":");

    const startTime = +splitStartTime[0] + +splitStartTime[1] / 60;
    const endTime = +splitEndTime[0] + +splitEndTime[1] / 60;
    if (!id) {
        const aetNoId: NiicAetNoId = {
            type,
            title,
            description,
            startTime,
            endTime,
            date,
            color,
        }
        const id = await addAetAndGetId_http(aetNoId);
        const aet: NiicAet = {
            id,
            ...aetNoId
        }
        aets.push(aet);
        localStorage.setItem("aets", JSON.stringify(aets));
    } else {
        console.log("HERE")
        const aet: NiicAet = {
            id,
            type,
            title,
            description,
            startTime,
            endTime,
            date,
            color,
        }
        const idx = aets.findIndex(aet => aet.id === id);
        aets[idx] = aet;
        await updateAet_http(aet);
        localStorage.setItem("aets", JSON.stringify(aets));
    }

    setAets();

    globalUpdateCalendar();
    hideAetInputPrompt();
}


function removeAetIdFromInputPrompt() {
    const promptEl: HTMLElement | null = document.querySelector(".niic-aet-input-prompt");
    promptEl?.setAttribute("data-id", "");
}