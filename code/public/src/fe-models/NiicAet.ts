interface NiicAet {
    id: number;

    title: string;
    description: string;
    date: Date;

    startTime: number;
    endTime: number;

    type: "appointment" | "event" | "task";

    color: string;
}

let currentGlobalId = 1;
function nextGlobalId() {
    return currentGlobalId++;
}