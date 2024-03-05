"use strict";
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
    const calMinimap = document.querySelector(".niic-cal-minimap");
    if (calMinimap) {
        calMinimap.dataset.firstDay = date.toDateString();
        calMinimap.dataset.month = date.getMonth().toString();
        if (calMinimap.setFirstDay) {
            calMinimap.setFirstDay(date.toDateString());
        }
    }
    // Calendar Times
    const timesDiv = document.querySelector(".niic-calendar-day-times");
    let timeHeight = undefined;
    if (timesDiv) {
        timesDiv.innerHTML = "";
        for (let i = 0; i < 24; i++) {
            const p = document.createElement("p");
            p.style.height = `calc(${window.innerHeight - 130}px / 23)`;
            p.textContent = `${i}`.padStart(2, '0');
            timesDiv.appendChild(p);
            timeHeight = p.style.height;
        }
    }
    // AETs
    let tmpDate = new Date(date.toDateString());
    for (let i = 0; i < 7; i++) {
        const zone = document.querySelector(`.niic-calendar-aet-zone-${i}`);
        // clear any existent AETs
        if (zone) {
            zone.innerHTML = ``;
            aets
                .filter(x => x.date.toDateString() === tmpDate.toDateString())
                .forEach(aet => {
                const div = document.createElement("div");
                div.style.position = "relative";
                div.style.top = `calc(${aet.startTime} * ${timeHeight})`;
                div.style.height = `calc(${aet.endTime - aet.startTime - 1} * ${timeHeight} + ${timeHeight} / 5)`;
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
                };
                zone.appendChild(div);
            });
        }
        tmpDate.setDate(tmpDate.getDate() + 1);
        // Change widths of headers
        for (let i = 0; i < 7; i++) {
            const zone = document.querySelector(`.niic-calendar-aet-zone-${i}`);
            const el = document.querySelector(`.niic-calendar-header-days-${i}`);
            if (zone && el) {
                el.style.width = `${zone.clientWidth}px`;
            }
        }
        // Update lists
        const getItemsHtml = (arr) => arr.map(x => `<li onclick="showAetEditPrompt(${x.id})">${x.title}</li>`).join("\n");
        const listTasks = document.querySelector(".niic-calendar-aside-list-tasks");
        if (listTasks) {
            listTasks.dataset.html = getItemsHtml(aets.filter(x => x.type === "task"));
            listTasks.connectedCallback();
        }
        const listEvents = document.querySelector(".niic-calendar-aside-list-events");
        if (listEvents) {
            listEvents.dataset.html = getItemsHtml(aets.filter(x => x.type === "event"));
            listEvents.connectedCallback();
        }
        const listAppointments = document.querySelector(".niic-calendar-aside-list-appointments");
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
