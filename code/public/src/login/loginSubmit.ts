async function onLoginSubmit(event: Event) {
    event.preventDefault();

    const nameInput: HTMLInputElement | null = document.querySelector(".niic-login-form-name");

    if (!nameInput || nameInput.value.trim() === "") {
        alert("Please enter a valid input");
        return;
    }

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": nameInput.value.trim()})
    });

    if (response.status != 200) {
        alert("User could not be logged in");
        return;
    }

    const body: {
        username: string,
        aets: NiicAet[]
    } = await response.json();

    localStorage.setItem("aets", JSON.stringify(body.aets));

    window.open('/sites/calendar.html', '_self');
}