class HeaderBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="niic-header">
                ${this.innerHTML}
            </nav>
            
            <style>
                * {
                    margin: 0;
                    padding: 0;
                }
                
                :root {
                    --max-width: calc(100vw - 81px);
                }
                
                .niic-header {
                    z-index: 1;
                    position: sticky;
                    top: 0;
                    left: 0;
                    
                    width: var(--max-width);
                    height: 130px;

                    background: linear-gradient(271.46deg, #0B00CC -83.97%, #32A38E 95.81%);
                    box-shadow: 0 4px 11px rgba(0, 0, 0, 0.25);
                }
                
                button {
                    font-size: 1.5rem;
                    background-color: #18333e;
                    padding: 15px;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    transition: background-color ease-in-out .05s,
                                transform ease-in-out .05s;
                                
                    cursor: pointer;
                    
                    &:hover {
                        transform: scale(1.02);
                        background-color: #122f3b;
                    }
                }
            </style>
        `;
    }
}

customElements.define('niic-header-bar', HeaderBar);