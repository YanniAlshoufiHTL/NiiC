const TimePattern = /^((([01][0-9])|(2[0-3])):[0-5][0-9])$|^24:00$/;

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

    const aetPositioningContainer = document.querySelector(".niic-aet-input-prompt") as HTMLElement | undefined;

    if (aetPositioningContainer !== undefined) {
        aetPositioningContainer.style.left = `50%`;
        aetPositioningContainer.style.top = `50%`;
        aetPositioningContainer.style.position = "relative";
        aetPositioningContainer.style.translate = "-50% -50%";
    }
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

    const timeFrom = promptForTimeWithCheck("From:", times[0]);
    const timeTo = promptForTimeWithCheck("To:", times[1]);

    const splitFrom = timeFrom.split(":");
    const splitTo = timeTo.split(":");

    const stampFrom = +splitFrom[0] * 60 + +splitFrom[1];
    const stampTo = +splitTo[0] * 60 + +splitTo[1];

    if (stampFrom <= stampTo) {
        btn.textContent = `${timeFrom} – ${timeTo}`;
    } else {
        promptTimeChange();
    }
}

function promptForTimeWithCheck(message: string, defaultTime: string, falseTriesCount: number = 0): string {
    if (falseTriesCount === 1) {
        message = `Please format the time correctly. (HH:MM)\n${message}`;
    }

    const time = prompt(message, defaultTime) ?? "";
    return TimePattern.test(time)
        ? time
        : promptForTimeWithCheck(message, defaultTime, falseTriesCount + 1);
}

let xOnClient = 0;
let yOnClient = 0;

document.addEventListener("mousemove", e => {
    xOnClient = e.clientX;
    yOnClient = e.clientY;
});

function showAetEditPrompt(shouldUseCursor: boolean, id: number) {
    const aetInputPromptBg = document.querySelector(".niic-aet-input-prompt-container") as HTMLElement | undefined;

    if (!aetInputPromptBg) {
        console.error("Could not show prompt container because element doesn't seem to exist.");
        return;
    }

    aetInputPromptBg.classList.remove("hidden");

    console.log(shouldUseCursor)
    if (shouldUseCursor) {
        const aetPositioningContainer = document.querySelector(".niic-aet-input-prompt") as HTMLElement | undefined;

        if (aetPositioningContainer !== undefined) {
            aetPositioningContainer.style.left = `${xOnClient}px`;
            aetPositioningContainer.style.top = `${yOnClient}px`;
            aetPositioningContainer.style.position = "absolute";

            const xOffset = xOnClient <= window.screen.width / 2 ? "0" : "-100%";
            const yOffset = yOnClient <= window.screen.height / 2 ? "0" : "-100%";

            aetPositioningContainer.style.translate = `${xOffset} ${yOffset}`;

            console.log(aetPositioningContainer.style.left)
            console.log(aetPositioningContainer.style.top)
        }
    }

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
    const timeFormat = (time: number) => Math.floor(time).toString().padStart(2, "0");
    const timeToStr = (time: number) => `${timeFormat(time)}:${timeFormat(Math.round((time - Math.floor(time)) * 60))}`;
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
    colorEl!.value = color;
}

async function submitAetInputPrompt(ev: SubmitEvent) {
    ev.preventDefault();

    const id = getIdFromPromptDatasetIfExistent();

    const aetNoId = getAetNoIdFromPrompt();

    if (aetNoId === false) {
        alert("Please fill all fields!");
        return;
    }

    if (!id) {
        await addAetLocallyAndOnServer(aetNoId);
    } else {
        await updateAetLocallyAndOnServer({id, ...aetNoId,})
    }

    setAets();

    globalUpdateCalendar();
    hideAetInputPrompt();
}


function removeAetIdFromInputPrompt() {
    const promptEl: HTMLElement | null = document.querySelector(".niic-aet-input-prompt");
    promptEl?.setAttribute("data-id", "");
}

async function addAetLocallyAndOnServer(aetNoId: NiicAetNoId) {
    const id = await addAetAndGetId_http(aetNoId);
    const aet: NiicAet = {
        id,
        ...aetNoId
    }
    aets.push(aet);
    localStorage.setItem("aets", JSON.stringify(aets));
}

async function updateAetLocallyAndOnServer(aet: NiicAet) {
    const id = aet.id;
    const idx = aets.findIndex(innerAet => innerAet.id === id);
    aets[idx] = aet;
    await updateAet_http(aet);
    localStorage.setItem("aets", JSON.stringify(aets));
}

function getIdFromPromptDatasetIfExistent(): number | false {
    const promptEl = getHtmlElement(".niic-aet-input-prompt");
    return promptEl && promptEl.dataset.id && /^\d+$/.test(promptEl.dataset.id)
        ? +promptEl.dataset.id
        : false;
}

function getAetNoIdFromPrompt(): {
    title: string,
    description: string,
    date: Date,
    type: "appointment" | "event" | "task",
    color: string,
    startTime: number,
    endTime: number,
    calendarId: number,
} | false {
    const calendarId = localStorage.getItem("calendarId");

    if (calendarId === null || /\d+/.test(calendarId) === false) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return false;
    }

    const {title, description, date, timeStr, type, color} = getRawAetPromptValues();

    if (!title || description === undefined || description === null || !date || !timeStr || !type || !color ||
        type !== "appointment" && type !== "event" && type !== "task") {

        alert("Sorry, an internal error occurred, please try again or contact us.");
        return false;
    }

    const times = extractTimesFromTimesStr(timeStr);

    if (times === false) {
        alert("The times string provided is not correctly formatted!");
        return false;
    }

    const {startTime, endTime} = times;


    return {
        title,
        description,
        date,
        type,
        color,
        startTime,
        endTime,
        calendarId: +calendarId,
    };
}

function getRawAetPromptValues() {
    const title = getHtmlElement<HTMLInputElement>(".niic-aet-input-prompt-title")?.value;
    const description = getHtmlElement<HTMLTextAreaElement>(".niic-aet-input-prompt-description-textarea")?.value;
    const date = getHtmlElement<HTMLInputElement>(".niic-aet-input-date")?.valueAsDate;
    const timeStr = getHtmlElement(".niic-aet-btn-time")?.textContent?.trim();
    const type: "appointment" | "event" | "task" | string | undefined =
        getHtmlElement<HTMLSelectElement>(".niic-aet-type-select")?.value;
    const color = getHtmlElement<HTMLInputElement>(".niic-color-btn")?.value;

    return {
        title,
        description,
        date,
        timeStr,
        type,
        color,
    };
}

function extractTimesFromTimesStr(timeStr: string): {
    startTime: number,
    endTime: number
} | false {
    const timesPattern = /^\d\d:\d\d . \d\d:\d\d$/;
    if (!timesPattern.test(timeStr)) {
        return false;
    }

    const times = timeStr.split(" ").filter(x => x.length === 5);
    const startTimeStr = times[0];
    const endTimeStr = times[1];

    if (!TimePattern.test(startTimeStr) || !TimePattern.test(endTimeStr)) {
        return false;
    }

    if (startTimeStr > endTimeStr) {
        return false;
    }

    const splitStartTime = startTimeStr.split(":");
    const splitEndTime = endTimeStr.split(":");

    const startTime = +splitStartTime[0] + +splitStartTime[1] / 60;
    const endTime = +splitEndTime[0] + +splitEndTime[1] / 60;

    return {startTime, endTime}
}

function getHtmlElement<T extends HTMLElement>(selector: string) {
    return document.querySelector(selector) as T | null;
}

