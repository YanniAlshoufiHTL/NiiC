async function addAetAndGetId_http(aet: NiicAetNoId): Promise<number> {
    const response = await fetch("/api/aets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": aet.title,
            "description": aet.description,
            "date": aet.date,
            "startTime": Math.round(aet.startTime),
            "endTime": Math.round(aet.endTime),
            "type": aet.type,
            "color": aet.color,
            "calendarId": 1
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