async function updateAet_http(aet: NiicAet) {
    const calendarId = localStorage.getItem("calendarId");

    if (calendarId === null || /\d+/.test(calendarId) === false) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return -1;
    }

    const response = await fetch(`/api/aets/${aet.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": aet.title,
            "description": aet.description,
            "date": aet.date,
            "startTime": aet.startTime,
            "endTime": aet.endTime,
            "type": aet.type,
            "color": aet.color,
            "calendarId": calendarId,
        })
    });

    if (response.status !== 204 /* NO CONTENT */) {
        console.error(response.status);
        console.error(await response.text());
        return;
    }
}