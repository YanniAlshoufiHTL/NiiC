"use strict";
let currentGlobalId = 1;
function nextGlobalId() {
    return currentGlobalId++;
}
