class SideBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="niic-navigation">
                <span class="niic-icon-container" onclick="window.open('/', '_parent')">
                    <img src="/img/home.svg" alt="Home Icon">
                    <h1>Home</h1>
                </span>
                <span class="niic-icon-container" onclick="window.open('/sites/docs.html', '_parent')">
                    <img src="/img/docs.svg" alt="Docs Icon">
                    <h1>Docs</h1>
                </span>
                <span class="niic-icon-container" onclick="window.open('/sites/store.html', '_parent')">
                    <img src="/img/store.svg" alt="Plugins Icon">
                    <h1>Plugins</h1>
                </span>
                <span class="niic-icon-container" onclick="window.open('/sites/calendar.html', '_parent')">
                    <img src="/img/calendar.svg" alt="Calendar Icon">
                    <h1>Calendar</h1>
                </span>
                <span class="niic-icon-container niic-profile-icon-container" onclick="window.open('/sites/profile.html', '_parent')">
                    <img src="/img/profile.svg" alt="Profile Icon">
                    <h1>Profile</h1>
                </span>
            </nav>
            
            <style>
                * {
                    margin: 0;
                    padding: 0;
                }
            
                .niic-navigation {
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    right: 0;
                    background-color: #24424b;
                    width: 81px;
                    height: 100vh;
                    box-sizing: border-box;
                    padding-bottom: 5%;
                    padding-top: 5%;
                    
                    >.niic-icon-container {
                        width: 81px;
                        height: 81px;
                    
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        gap: 5px;
                        
                        >img {
                            width: 40%;
                            height: 40%;
                            
                            transition: transform ease-in-out .1s;
                        }
                        
                        >h1 {
                            transition: transform ease-in-out .1s;
                            font-family: system-ui, sans-serif;
                            font-size: .75rem;
                            text-align: center;
                            color: white;
                        }
                        
                        cursor: pointer;
                        &:hover {
                            >img {
                                transform: scale(1.1);
                            }
                            >h1 {
                                transform: scale(1.05);
                            }
                        }
                    }
                    
                    >.niic-profile-icon-container {
                        margin-top: auto;
                    }
                }
            </style>
        `;
    }
}

customElements.define('niic-sidebar', SideBar);