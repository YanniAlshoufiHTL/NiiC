function globalUpdateCalendar() {
    // Btn Header
    const btnEl = document.querySelector(".niic-date-btn");
    if (btnEl) {
        btnEl.innerHTML = date.toDateString();
    }

    // Header days
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dateTmp = new Date(date.toDateString());
    for (let i = 0; i < 7; i++) {
        const el = document.querySelector(`.niic-calendar-header-days-${i}`);
        if (el) {
            el.innerHTML = `${days[dateTmp.getDay()]}<br>${dateTmp.getDate()}`;
        }
        dateTmp.setDate(dateTmp.getDate() + 1);
    }

    // Calendar Minimap
    const calMinimap: CalendarMinimap | null = document.querySelector(".niic-cal-minimap");
    if (calMinimap) {
        calMinimap.dataset.firstDay = date.toDateString();
        calMinimap.dataset.month = date.getMonth().toString();
        if (calMinimap.setFirstDay) {
            calMinimap.setFirstDay(date.toDateString());
        }
    }

    // Calendar Times
    const timesDiv = document.querySelector(".niic-calendar-day-times");

    if (timesDiv) {
        for (let i = 1; i < 24; i++) {
            const p = document.createElement("p");
            p.style.position = "absolute";
            p.style.marginTop = `calc(${window.innerHeight - 130}px * ${i} / 23)`;
            p.textContent = `${i}`.padStart(2, '0');
            timesDiv.appendChild(p);
        }
    }

    // AETs
    let tmpDate = new Date(date.toDateString());
    for (let i = 0; i < 7; i++) {
        const zone: HTMLDivElement | null = document.querySelector(`.niic-calendar-aet-zone-${i}`);
        // clear any existent AETs
        if (zone) {

            zone.innerHTML = ``;
            aets
                .filter(x => x.date.toDateString() === tmpDate.toDateString())
                .forEach(aet => {
                    const div: HTMLDivElement = document.createElement("div");
                    div.style.marginTop = `calc(${window.innerHeight - 130}px * ${aet.startTime} / 23)`;
                    div.style.height = `calc(${aet.endTime - aet.startTime + 1} * 100% / 23)`
                    div.innerText = aet.title;
                    div.draggable = true;
                    div.id = `niic-calendar-aet-${aet.id}`;
                    div.onclick = () => showAetEditPrompt(aet.id);
                    div.style.background = aet.color;
                    div.style.border = `1px solid color-mix(in srgb, ${aet.color}, #333333)`;
                    div.ondragstart = ev => {
                        if (ev.target && ev.target instanceof HTMLElement) {
                            ev.dataTransfer?.setData("Title", ev.target.id);
                        }
                    }
                    zone.appendChild(div);
                });

        }

        tmpDate.setDate(tmpDate.getDate() + 1);

        // Change widths of headers
        for (let i = 0; i < 7; i++) {
            const zone = document.querySelector(`.niic-calendar-aet-zone-${i}`);
            const el: HTMLElement | null = document.querySelector(`.niic-calendar-header-days-${i}`);
            if (zone && el) {
                el.style.width = `${zone.clientWidth}px`;
            }
        }

        // Update lists
        const getItemsHtml = (arr: NiicAet[]) =>
            arr.map(x => `<li>${x.title}</li>`).join("\n");

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
}

setTimeout(() => {
    globalUpdateCalendar();
}, 0);

window.addEventListener("resize", globalUpdateCalendar);

