const elements = [];

for (let i = 0; i < 7; i++) {
    elements.push(`
                    <div class="niic-calendar-aet-zone niic-calendar-aet-zone-${i}"
                        ondragover="allowDrop(event)"
                        ondrop="drop(event)"
                        id="niic-calendar-aet-zone-${i}"
                    ></div>
                `);
}

function allowDrop(ev: DragEvent) {
    // The if statement prevents drag-and-drop on other elements (e. g. other AETs)
    if (ev.target instanceof HTMLElement && ev.target.classList.contains("niic-calendar-aet-zone")) {
        ev.preventDefault();
    }
}

async function drop(ev: DragEvent) {
    const data = ev.dataTransfer?.getData("Title");
    if (data) {
        const element: HTMLElement | null = document.getElementById(data);

        if (element && ev.target && ev.target instanceof HTMLElement) {
            ev.target.appendChild(element);

            const splitId = ev.target.id.split("-");
            const idx = +splitId[splitId.length - 1];

            const tmpDate = new Date(date.toDateString());
            tmpDate.setDate(tmpDate.getDate() + idx);
            tmpDate.setTime(tmpDate.getTime() + (1 /*hours*/) * 60 * 60 * 1000);

            const idSplit = element.id.split("-");
            const id = +idSplit[idSplit.length - 1];

            const aetIdx = aets.findIndex(x => x.id === id);
            aets[aetIdx].date = tmpDate;

            const headerEl = document.querySelector(".niic-header-list") as HTMLElement;
            const elHeight = window.innerHeight - headerEl.offsetHeight - 20;

            const offsetInEl = ev.clientY - headerEl.offsetHeight;
            let finalHours: number = offsetInEl / elHeight * 24;

            const timeDelta = aets[aetIdx].endTime - aets[aetIdx].startTime;

            if (finalHours < 0) {
                finalHours = 0;
            }

            if (finalHours + timeDelta > 24) {
                finalHours = 24 - timeDelta;
            }

            aets[aetIdx].startTime = finalHours;
            aets[aetIdx].endTime = finalHours + timeDelta;

            await updateAet_http(aets[aetIdx]);
            globalUpdateCalendar();
            localStorage.setItem("aets", JSON.stringify(aets));
        }
    }
    ev.preventDefault();
}

const calMain = document.querySelector(".niic-calendar-main");
if (calMain) {
    calMain.innerHTML = elements.join("\n");
}
