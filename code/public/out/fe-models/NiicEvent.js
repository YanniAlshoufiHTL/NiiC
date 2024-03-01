"use strict";
class NiicEvent extends NiicAet {
    aetTypeName = "Event";
    aetTypeNamePlural = `${this.aetTypeName}s`;
    constructor(title, startTime, endTime, description, date, aetTypeNamePlural) {
        super(title, startTime, endTime, description, date);
        this.aetTypeNamePlural = aetTypeNamePlural;
    }
}
