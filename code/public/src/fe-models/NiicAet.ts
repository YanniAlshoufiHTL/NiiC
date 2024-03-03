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

let currentGlobalId = 0;
function nextGlobalId() {
    return currentGlobalId++;
}