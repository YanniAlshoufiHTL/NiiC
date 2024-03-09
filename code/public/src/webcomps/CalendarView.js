"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// class CalendarView extends HTMLElement {
//     constructor() {
//         super();
//     }
//
//     connectedCallback() {
//         this.innerHTML = `
//             <script>
//                 const date = new Date(Date.now());
//
//                 function update() {
//                     const dateBtn = document.querySelector(".niic-date-btn");
//                     if (!dateBtn) {
//                         console.log("CSS class not found.")
//                         return;
//                     }
//
//                     dateBtn.innerHTML = date.toDateString();
//                 }
//
//                 /**
//                 * @param dayCount {number}
//                 */
//                 function offsetDateByDays(dayCount) {
//                     date.setDate(date.getDate() + dayCount);
//                     update();
//                 }
//             </script>
//
//
//             <niic-header-bar>
//                 <div class="niic-header-list">
//                     <button class="niic-date-left-arrow""offsetDateByDays(-1)"><</button>
//                     <button class="niic-date-btn"></button>
//                     <button class="niic-date-right-arrow">></button>
//                 </div>
//
//                 <style>
//                     .niic-header-list {
//                         width: 100%;
//                         height: 100%;
//                         display: flex;
//                         justify-content: center;
//                         align-items: center;
//                         gap: 5px;
//                     }
//                 </style>
//             </niic-header-bar>
//
//             <aside>
//                 <niic-calendar-minimap></niic-calendar-minimap>
//             </aside>
//
//             <script>
//                 const minimap = document.querySelector("niic-calendar-minimap");
//                 const leftArrow = document.querySelector("niic-date-left-arrow")
//                 const dateBtn = document.querySelector("niic-date-btn")
//                 const rightArrow = document.querySelector("niic-date-right-arrow")
//
//                 dateBtn.onclick = () => {
//                     console.log("hi")
//                    date.setDate(Date.now());
//                    update();
//                 }
//             </script>
//
//             <style>
//                 aside {
//                     width: 200px;
//                     height: 60vh;
//                     background-color: red;
//                 }
//             </style>
//         `;
//     }
// }
//
// customElements.define('niic-calendar-view', CalendarView);
