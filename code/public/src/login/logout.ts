async function logoutUser() {
    const userId = localStorage.getItem("userId");

    if (userId !== null) {
        if (/^\d+$/.test(userId)) {
            const res = await fetch(`/api/users/logout/${userId}`);

            if (res.status !== 203) {
                console.error("The logout on the server wasn't successful.");
                console.error(await res.text());
            }
            else {
                console.info("User has been logged out!");
            }
        } else {
            console.error(`User id "${userId}" isn't a valid number!`);
        }
    }

    localStorage.removeItem("aets");
    localStorage.removeItem("jwt");
    localStorage.removeItem("blockModules");
    localStorage.removeItem("fullName");
    localStorage.removeItem("installedBlockModules");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    window.open("/", "_self");
}