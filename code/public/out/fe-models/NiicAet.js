"use strict";
let currentGlobalId = 0;
function nextGlobalId() {
    return currentGlobalId++;
}
