async function addAetAndGetId_http(aet: NiicAetNoId): Promise<number> {
    const calendarId = localStorage.getItem("calendarId");

    if (calendarId === null || /\d+/.test(calendarId) === false) {
        alert("You are not logged in correctly!");
        window.open("/", "_self");
        return -1;
    }

    const response = await fetch("/api/aets", {
        method: "POST",
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
            "calendarId": +calendarId,
        })
    });

    if (response === null) {
        alert("Response was null");
    }

    if (response.status !== 201) {
        alert("Invalid, Status Code: " + response.status);
    }

    const responseData = await response.json();
    return responseData.id;
}