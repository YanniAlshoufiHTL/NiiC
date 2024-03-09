"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CalendarMinimap extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = this.getHtml();
    }
    getPs() {
        const firstDay = this.dataset.firstDay;
        const month = this.dataset.month;
        const monthPattern = /^[0-9]|(1[01])$/;
        if (!firstDay) {
            return "";
        }
        const date = new Date(Date.parse(firstDay));
        const htmlTagTexts = [];
        for (let i = 0; i < 42; i++) {
            const monthString = month && monthPattern.test(month) && +month === date.getMonth()
                ? ``
                : `niic-calendar-minimap-gray`;
            htmlTagTexts.push(`<p class="${monthString}">${date.getDate()}</p>`);
            date.setDate(date.getDate() + 1);
        }
        return htmlTagTexts.join('\n');
    }
    setFirstDay(firstDay) {
        this.dataset.firstDay = firstDay;
        this.innerHTML = this.getHtml();
    }
    getCalHeaders() {
        const firstDay = this.dataset.firstDay;
        if (!firstDay) {
            return "";
        }
        const date = new Date(Date.parse(firstDay));
        const day = date.getDay();
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const daysHtml = [];
        for (let i = 0; i < 7; i++) {
            daysHtml.push(`<b>${days[(day + i) % 7]}</b>`);
        }
        return daysHtml.join("\n");
    }
    getHtml() {
        return `
            <nav class="niic-calendar-minimap">
                ${this.getCalHeaders()}
                ${this.getPs()}
            </nav>
            
            <style>
               .niic-calendar-minimap {
                   background-color: #466874;
                   width: 262px;
                   height: 200px;
                   padding: 20px;
                   border-radius: 7px;
                   box-sizing: border-box;
                   
                   display: grid;
                   grid-template-columns: repeat(7, 1fr);
                   gap: 2px;
                   
                   >p, b {
                       color: white;
                       
                       display: flex;
                       justify-content: center;
                       align-items: center;
                       
                       font-family: system-ui, sans-serif;
                   }
                   
                   > b {
                       margin-bottom: 5px;
                   }
                   
                   .niic-calendar-minimap-gray {
                       color: #D9D9D9;
                   }
               }
              
            </style>
        `;
    }
}
customElements.define('niic-calendar-minimap', CalendarMinimap);
