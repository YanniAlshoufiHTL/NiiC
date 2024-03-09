export interface NiicAet {
    id: number;

    title: string;
    description: string;
    date: Date;

    startTime: number;
    endTime: number;

    type: "appointment" | "event" | "task";

    color: string;
}