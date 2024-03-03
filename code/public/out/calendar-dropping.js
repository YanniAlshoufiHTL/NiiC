"use strict";
const els = [];
for (let i = 0; i < 7; i++) {
    els.push(`
                    <div class="niic-calendar-aet-zone niic-calendar-aet-zone-${i}"
                        ondragover="allowDrop(event)"
                        ondrop="drop(event)"
                        id="niic-calendar-aet-zone-${i}"
                    ></div>
                `);
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev) {
    const data = ev.dataTransfer?.getData("Title");
    if (data) {
        const el = document.getElementById(data);
        if (el && ev.target && ev.target instanceof HTMLElement) {
            ev.target.appendChild(el);
            const splitId = ev.target.id.split("-");
            const idx = +splitId[splitId.length - 1];
            const tmpDate = new Date(date.toDateString());
            tmpDate.setDate(tmpDate.getDate() + idx);
            const idSplit = el.id.split("-");
            const id = +idSplit[idSplit.length - 1];
            aets
                .filter(x => x.id === id)
                .forEach(x => x.date = tmpDate);
        }
    }
    ev.preventDefault();
}
const calMain = document.querySelector(".niic-calendar-main");
if (calMain) {
    calMain.innerHTML = els.join("\n");
}
