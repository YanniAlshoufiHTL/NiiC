"use strict";
class NiicTask extends NiicAet {
    aetTypeName = "Task";
    aetTypeNamePlural = `${this.aetTypeName}s`;
    constructor(title, startTime, endTime, description, date, aetTypeNamePlural) {
        super(title, startTime, endTime, description, date);
        this.aetTypeNamePlural = aetTypeNamePlural;
    }
}
