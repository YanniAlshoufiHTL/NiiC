async function updateAet_http(aet: NiicAet) {
    const calendarId = localStorage.getItem("calendarId");

    if (calendarId === null || /\d+/.test(calendarId) === false) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return -1;
    }

    const jwt = localStorage.getItem("jwt");

    if(jwt === null) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return;
    }

    const response = await fetch(`/api/aets/${aet.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
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