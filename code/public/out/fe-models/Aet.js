"use strict";
class Aet {
    #title;
    #description;
    #date;
    #startTime;
    #endTime;
    constructor(title, startTime, endTime, description = "", date = new Date(Date.now())) {
        this.#title = title;
        this.#description = description;
        this.#date = date;
        this.#startTime = startTime;
        this.#endTime = endTime;
    }
    get title() {
        return this.#title;
    }
    set title(title) {
        this.#title = title;
    }
    get description() {
        return this.#description;
    }
    set description(description) {
        this.#description = description;
    }
    get date() {
        return this.#date;
    }
    set date(date) {
        this.#date = date;
    }
    get startTime() {
        return this.#startTime;
    }
    set startTime(startTime) {
        if (0 <= startTime && startTime <= 24 && startTime <= this.#endTime) {
            this.#startTime = +startTime;
        }
    }
    get endTime() {
        return this.#endTime;
    }
    set endTime(endTime) {
        if (0 <= endTime && endTime <= 24 && endTime >= this.#startTime) {
            this.#endTime = endTime;
        }
    }
}
