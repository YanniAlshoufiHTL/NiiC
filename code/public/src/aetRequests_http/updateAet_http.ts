async function updateAet_http(aet: NiicAet) {
    console.log("updateAet_http: ", aet)
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
            "calendarId": 1,
        })
    });

    if (response.status !== 204 /* NO CONTENT */) {
        console.error(response.status);
        console.error(await response.text());
        return;
    }
}