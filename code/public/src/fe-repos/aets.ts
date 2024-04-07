let aets: NiicAet[];
setAets();

function setAets() {
    aets = JSON.parse(localStorage.getItem("aets") ?? "[]")
        .map((x: NiicAet) => {
            const tmp: NiicAet = {
                id: x.id,
                title: x.title,
                description: x.description,
                date: new Date(x.date),
                type: x.type,
                startTime: +x.startTime,
                endTime: +x.endTime,
                color: x.color,
            };
            return tmp;
        });
}