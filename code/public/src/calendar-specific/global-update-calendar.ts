function globalUpdateCalendar() {
    updateDateOfHeaderDateButton();
    updateDatesOfHeaderDayLabels();
    updateMinimapCalendar();
    const timeHeight = updateCalendarTimesAndGetHeightEach();
    updateHtmlAets(timeHeight);
}

setTimeout(() => {
    globalUpdateCalendar();
}, 0);

window.addEventListener("resize", globalUpdateCalendar);

function updateHtmlAets(timeHeight: string) {
    let tmpDate = new Date(date.toDateString());
    for (let i = 0; i < 7; i++) {
        const zone: HTMLDivElement | null = document.querySelector(`.niic-calendar-aet-zone-${i}`);

        if (zone) {
            zone.innerHTML = ``;

            aets
                .filter(x => x.date.toDateString() === tmpDate.toDateString())
                .forEach(aet => {
                    const div = getAetDiv(aet, timeHeight);
                    zone.appendChild(div);
                });
        }

        tmpDate.setDate(tmpDate.getDate() + 1);

        updateWidthsOfDayZones();
        updateAetListsOfAside();
    }
}

function getAetDiv(aet: NiicAet, timeHeight: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.style.position = "relative";
    div.style.top = `calc(${aet.startTime} * ${timeHeight})`;
    div.style.height = `calc(${aet.endTime - aet.startTime - 1} * ${timeHeight} + ${timeHeight} / 5)`;
    div.innerText = aet.title;
    div.draggable = true;
    div.id = `niic-calendar-aet-${aet.id}`;
    div.onclick = () => showAetEditPrompt(true, aet.id);
    div.style.background = aet.color;
    div.style.border = `1px solid color-mix(in srgb, ${aet.color}, #333333)`;
    div.ondragstart = ev => {
        if (ev.target && ev.target instanceof HTMLElement) {
            ev.dataTransfer?.setData("Title", ev.target.id);
        }
    }
    return div;
}

function updateAetListsOfAside() {
    const getItemsHtml = (arr: NiicAet[]) =>
        arr.map(x => `<li onclick="showAetEditPrompt(false, ${x.id})">${x.title}</li>`).join("\n");

    const listTasks: TitledSearchList | null = document.querySelector(".niic-calendar-aside-list-tasks");
    if (listTasks) {
        listTasks.dataset.html = getItemsHtml(aets.filter(x => x.type === "task"));
        listTasks.connectedCallback();
    }

    const listEvents: TitledSearchList | null = document.querySelector(".niic-calendar-aside-list-events");
    if (listEvents) {
        listEvents.dataset.html = getItemsHtml(aets.filter(x => x.type === "event"));
        listEvents.connectedCallback();
    }

    const listAppointments: TitledSearchList | null = document.querySelector(".niic-calendar-aside-list-appointments");
    if (listAppointments) {
        listAppointments.dataset.html = getItemsHtml(aets.filter(x => x.type === "appointment"));
        listAppointments.connectedCallback();
    }
}

function updateWidthsOfDayZones() {
    for (let i = 0; i < 7; i++) {
        const zone = document.querySelector(`.niic-calendar-aet-zone-${i}`);
        const el: HTMLElement | null = document.querySelector(`.niic-calendar-header-days-${i}`);
        if (zone && el) {
            el.style.width = `${zone.clientWidth}px`;
        }
    }
}

function updateDateOfHeaderDateButton() {
    const btnEl = document.querySelector(".niic-date-btn");
    if (btnEl) {
        btnEl.innerHTML = date.toDateString();
    }
}

function updateDatesOfHeaderDayLabels() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dateTmp = new Date(date.toDateString());
    for (let i = 0; i < 7; i++) {
        const el = document.querySelector(`.niic-calendar-header-days-${i}`);
        if (el) {
            el.innerHTML = `${days[dateTmp.getDay()]}<br>${dateTmp.getDate()}`;
        }
        dateTmp.setDate(dateTmp.getDate() + 1);
    }
}

function updateMinimapCalendar() {
    const calMinimap: CalendarMinimap | null = document.querySelector(".niic-cal-minimap");
    if (calMinimap) {
        calMinimap.dataset.firstDay = date.toDateString();
        calMinimap.dataset.month = date.getMonth().toString();
        if (calMinimap.setFirstDay) {
            calMinimap.setFirstDay(date.toDateString());
        }
    }
}

function updateCalendarTimesAndGetHeightEach(): string {
    const timesDiv: HTMLDivElement | null = document.querySelector(".niic-calendar-day-times");
    let timeHeight = "0px";

    if (timesDiv) {
        timesDiv.innerHTML = "";

        for (let i = 0; i < 24; i++) {
            const p = document.createElement("p");

            p.style.height = `calc(${window.innerHeight - 130}px / 24)`;
            p.textContent = `${i}`.padStart(2, '0');

            timesDiv.appendChild(p);

            timeHeight = p.style.height;
        }
    }

    return timeHeight;
}