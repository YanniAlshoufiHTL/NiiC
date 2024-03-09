"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let currentGlobalId = 1;
function nextGlobalId() {
    return currentGlobalId++;
}
