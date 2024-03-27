class PluginListing extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const mods = [
            {
                title: "Clock Widget",
                description: "A clock widget that shows the current time in a set timezone.",
                additionalText: "by you, yanni, and 2 others",
                type: "blm",
            },
            {
                title: "Catputccin Theme",
                description: null,
                additionalText: "by you, ibo, and 2 others",
                type: "bgm",
            },
            {
                title: "Category Option",
                description: null,
                additionalText: "by you, gugi, and 2 others",
                type: "dtm",
            },
            {
                title: "Moodle Kit",
                description: null,
                additionalText: "by you, gugi, and 2 others",
                type: "mbn",
            },
            {
                title: "Todo List Widget",
                description: "A simple plugin for creating and managing a todo list in a widget.",
                additionalText: "by you, yanni, and 2 others",
                type: "blm",
            },
        ];

        const modsHtml = mods
            .map(mod => `
                <div class="niic-plugin-item">
                    <p class="niic-plugin-item-name">${mod.title}</p>
                    <p class="niic-plugin-item-creator">${mod.additionalText}</p>
                    <p class="niic-plugin-item-description">${mod.description ? mod.description : "No description."}</p>
                    <button class="niic-plugin-item-module-type">${mod.type === "blm" ? "Block Module" :  
                                                                   mod.type === "bgm" ? "Block Module" :
                                                                   mod.type === "dtm" ? "Data Module" :
                                                                   "Module Bundle"}</button>
                    <button class="niic-plugin-item-download-button">
                        <img class="niic-plugin-item-download-btn-image" src="/img/download.png" alt="">
                        Code
                    </button>
                    <img class="niic-plugin-item-show-image" src="/img/show.png" alt="show item image">
                </div>
            `)
            .join("");

        this.innerHTML = `
            <div class="niic-plugin-items-container">
                ${modsHtml}
            </div>

            
            <style>
                .niic-plugin-items-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);

                    position: relative;
                    width: 90%;
                    left: 5%;

                    padding: 30px 0;

                    gap: 25px;

                    .niic-plugin-item {
                        position: relative;

                        background: #24424B;
                        border-radius: 20px;

                        font-size: 1.5rem;

                        padding: 0 15px 15px;

                        .niic-plugin-item-name {
                            margin-top: 17px;

                            font-family: system-ui, sans-serif;
                            color: #FFFFFF;
                            
                            max-width: 60%;
                        }

                        .niic-plugin-item-creator {
                            margin-top: 13px;

                            font-family: system-ui, sans-serif;
                            font-weight: 400;
                            font-size: .6em;

                            display: flex;
                            align-items: center;

                            color: #7EB4C8;
                        }

                        .niic-plugin-item-description {
                            margin-top: 7px;

                            font-family: system-ui, sans-serif;
                            font-weight: 400;
                            font-size: .9em;

                            line-height: 18px;

                            color: rgba(255, 255, 255, 0.5);
                        }
                        
                        .niic-plugin-item-module-type {
                            position: absolute;
                            right: 0;
                            top: 0;

                            width: 100px;
                            height: 46px;

                            color: white;
                            background: #18333E;
                            border-top-right-radius: 20px;
                            border: 1px solid #18333E;
                        }

                        .niic-plugin-item-download-button {
                            margin-top: 15px;

                            width: 90px;
                            height: 35px;

                            color: white;
                            background: #18333E;
                            border-radius: 5px;
                            border: 1px solid #18333E;

                            .niic-plugin-item-download-btn-image {
                                width: 20px;
                                height: 20px;
                            }
                        }

                        .niic-plugin-item-show-image {
                            position: absolute;
                            top: 70%;
                            left: 80%;
                            width: 32px;
                            height: 25px;
                        }
                    }
                }
            </style>    
            `;
    }
}

customElements.define('niic-plugin-listing', PluginListing);
