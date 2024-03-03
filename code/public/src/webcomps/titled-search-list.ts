class TitledSearchList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="niic-titled-search-list-container">
                <span class="niic-titled-search-list-bar">
                    <h1>${this.dataset.title ? this.dataset.title : "Search"}</h1>
                    <img src="/img/loop.svg" alt="Loop Icon">
                </span>
                <ul class="niic-titled-search-list-ul">
                    ${this.dataset.html ? this.dataset.html : this.innerHTML}
                </ul>
            </div>
            
            <style>
                .niic-titled-search-list-container {
                    width: 266px;
                    
                    color: white;
                    font-family: system-ui, sans-serif;
                }
                
                .niic-titled-search-list-bar {
                    background-color: #466874;
                    
                    width: 100%;
                    height: 62px;
                
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    
                    padding: 0 20px;
                    
                    box-sizing: border-box;
                    
                    img {
                        cursor: pointer;
                    }
                }
                
                .niic-titled-search-list-ul {
                    list-style: none;
                    
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 10px;
                    padding-left: 20px;
                    
                    li {
                       color: black;
                       text-decoration: underline;
                       cursor: pointer;
                       font-size: 1.2rem;
                       
                       overflow: hidden;
                       text-overflow: ellipsis;
                       white-space: nowrap;
                        
                       &:hover {
                           color: dodgerblue;
                       }
                    }
                }
            </style>
        `;
    }
}

customElements.define('niic-titled-search-list', TitledSearchList);