async function onLoginSubmit(event: Event) {
    event.preventDefault();

    const nameInput: HTMLInputElement | null = document.querySelector(".niic-login-signIn-input-username");
    const password: HTMLInputElement | null = document.querySelector(".niic-login-signIn-input-password");

    if (!nameInput || nameInput.value.trim() === "") {
        alert("Please enter a valid input");
        return;
    }

    const response = await fetch("/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": nameInput.value.trim(), "password": password?.value})
    });

    if (response.status !== 200) {
        alert("User could not be logged in");
        return;
    }

    const body: {
        id: number,
        username: string,
        aets: NiicAet[],
        jwt: string
    } = await response.json();

    localStorage.setItem("aets", JSON.stringify(body.aets));
    localStorage.setItem("userId", body.id.toString());
    localStorage.setItem("jwt", body.jwt);

    window.open('/sites/calendar.html', '_self');
}

async function onSignUpSubmit(event: Event){
  
    event.preventDefault();

    const nameInput: HTMLInputElement | null = document.querySelector(".niic-login-signUp-input-username");
    const password: HTMLInputElement | null = document.querySelector(".niic-login-signUp-input-password");
    const repeatPassword: HTMLInputElement | null = document.querySelector(".niic-login-signUp-input-repeatedPassword");

    if (!nameInput || nameInput.value.trim() === "") {
        alert("Please enter a valid input");
        return;
    }

    if(password?.value === repeatPassword?.value) {
        const response = await fetch("/login/sign-up", {
            body: JSON.stringify({"username": nameInput.value.trim(), "password": password?.value}),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status !== 200) {
            alert("User could not be registered");
            return;
        }

        const body: {
            id: number,
            username: string,
            aets: NiicAet[],
            jwt: string
        } = await response.json();

        localStorage.setItem("aets", JSON.stringify(body.aets));
        localStorage.setItem("userId", body.id.toString());
        localStorage.setItem("jwt", body.jwt);
    }
    else{
        alert("passwords need to be equal");
        return
    }
    window.open('/sites/calendar.html', '_self');
}