class BlockModuleArea extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="niic-block-module-area${this.dataset.hidden === "hidden" ? " niic-block-module-area-hidden" : ""}">
                <span class="niic-block-module-area-x">x</span>
                <div class="niic-block-module-area-modules">
                </div>
            </div>
            <div class="niic-block-module-area-parent"></div>
            
            <style>
            :root {
                --niic-block-module-area-width: 550px;
                --niic-block-module-area-border-radius: 10px;
                --niic-block-module-area-hide-animation-length: 0.3s;
            }
            
            .niic-block-module-area-parent {
                position: fixed;
                left: 0;
                top: 0;
                
                height: 100dvh;
                width: 100dvw;
                
                z-index: 10;
                
                background-color: rgba(0, 0, 0, .0);
            }
            
            .niic-block-module-area {
                position: fixed;
                right: 0;
                top: 0;
                
                padding: 40px 0;
                box-sizing: border-box;
            
                height: 100dvh;
                width: var(--niic-block-module-area-width); /* IGNORE ERROR */
                background: #648794 url("/img/niic-bg-block-module-area.png") no-repeat;
                background-size: cover;
                
                z-index: 11;
                
                transition: transform ease-in-out var(--niic-block-module-area-hide-animation-length); /* IGNORE ERROR */
                
                overflow: auto;
            }
            
            .niic-block-module-area-parent {
                transition: transform ease-in-out var(--niic-block-module-area-hide-animation-length); /* IGNORE ERROR */
            }
            
            .niic-block-module-area-hidden + .niic-block-module-area-parent {
                transform: translateX(calc(-100dvw - var(--niic-block-module-area-width))); /* IGNORE ERROR */
            }
            
            .niic-block-module-area-hidden {
                transform: translateX(var(--niic-block-module-area-width)); /* IGNORE ERROR */
            }
            
            .niic-block-module-area-x {
                position: absolute;
                right: 20px;
                top: 10px;
                
                font-size: 20px;
                font-family: system-ui, sans-serif;
                
                cursor: pointer;
                
                color: white;
                
                &:hover {
                    color: red;
                }
            }
            
            .niic-block-module-area-modules {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 35px;
                
                > .niic-block-module-area-module {
                    display: flex;
                    flex-direction: column;
                    
                    box-sizing: border-box;
                    
                    width: 88%;
                    height: 280px;
                    
                    background-color: white;
                    border-radius: var(--niic-block-module-area-border-radius); /* IGNORE ERROR */
                    
                    .niic-block-module-area-module-title {
                        font-family: system-ui, sans-serif;
                        font-size: 12px;
                        
                        padding: 2px 10px;
                        box-sizing: border-box;
                        
                        background-color: #222;
                        color: white;
                        
                        border-top-left-radius: var(--niic-block-module-area-border-radius); /* IGNORE ERROR */
                        border-top-right-radius: var(--niic-block-module-area-border-radius); /* IGNORE ERROR */
                    }
                    
                    .niic-block-module-area-module-iframe {
                        flex: 1;
                        width: 100%;
                        border: none;
                        border-bottom-left-radius: var(--niic-block-module-area-border-radius); /* IGNORE ERROR */
                        border-bottom-right-radius: var(--niic-block-module-area-border-radius); /* IGNORE ERROR */
                    }
                }
            }
            
            </style>    
            `;
    }
}

customElements.define('niic-block-module-area', BlockModuleArea);

function hideBlockModuleArea() {
    const element = document.querySelector(".niic-block-module-area");

    if (!element) {
        console.error("niic-block-module-area not found");
        return;
    }

    element.setAttribute("data-hidden", "hidden");
    element.classList.add("niic-block-module-area-hidden");
}

const xElement = document.querySelector(".niic-block-module-area-x");
const parentElement = document.querySelector(".niic-block-module-area-parent");

if (xElement) {
    xElement.addEventListener("click", hideBlockModuleArea);
}

if (parentElement) {
    parentElement.addEventListener("click", (e) => {
        if (e.target === parentElement) {
            hideBlockModuleArea();
        }
    });
}

const modulesElement = document.querySelector(".niic-block-module-area-modules");

if (modulesElement) {
    for (const mod of blockModules) {
        // TODO
        // if (mod.type !== "blm" || !mod.html) {
        //     console.log(mod)
        //     continue;
        // }
        //
        //
        // const moduleElement = document.createElement("div");
        // moduleElement.classList.add("niic-block-module-area-module");
        //
        // const iframeElement = document.createElement("iframe");
        // iframeElement.srcdoc = `${mod.html}
        //                         <style>*{margin: 0;padding: 0;}${mod.css ? mod.css : ""}</style>
        //                         ${mod.js ? "<script>" + mod.js + "</script>" : ""}`;
        // iframeElement.classList.add("niic-block-module-area-module-iframe");
        //
        // moduleElement.innerHTML = `
        //     <h3 class="niic-block-module-area-module-title">${mod.title}</h3>
        //     ${iframeElement.outerHTML}
        // `;
        //
        // modulesElement.append(moduleElement);
    }
}



