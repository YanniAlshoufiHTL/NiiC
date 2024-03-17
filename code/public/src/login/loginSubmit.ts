async function onLoginSubmit(event: Event) {
    event.preventDefault();
    const nameInput : HTMLInputElement | null = document.querySelector(".niic-login-form-name");
    if(!nameInput || nameInput.value.trim() === ""){
        alert("Please enter a valid input");
    }
    const response = await fetch("/api/users/login", {
        method: "POST",
        body: nameInput?.value
    });

    if(response.status != 200) {
        alert("User could not be logged in");
    }

    //safe AETs in globale variable

    //window.open('/sites/calendar.html', '_self');
}