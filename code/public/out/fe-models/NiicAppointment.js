"use strict";
class NiicAppointment extends NiicAet {
    aetTypeName = "Appointment";
    aetTypeNamePlural = `${this.aetTypeName}s`;
    constructor(title, startTime, endTime, description, date, aetTypeNamePlural) {
        super(title, startTime, endTime, description, date);
        this.aetTypeNamePlural = aetTypeNamePlural;
    }
}
