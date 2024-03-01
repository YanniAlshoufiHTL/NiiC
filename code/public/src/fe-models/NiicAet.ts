abstract class NiicAet {
    public abstract readonly aetTypeName: string;
    public abstract readonly aetTypeNamePlural: string;

    #title: string;
    #description: string;
    #date: Date;

    #startTime: number;
    #endTime: number;

    protected constructor(
        title: string,
        startTime: number,
        endTime: number,
        description: string = "",
        date: Date = new Date(Date.now()),
    ) {
        this.#title = title;
        this.#description = description;
        this.#date = date;
        this.#startTime = startTime;
        this.#endTime = endTime;
    }

    public get title() {
        return this.#title;
    }

    public set title(title: string) {
        this.#title = title;
    }


    public get description() {
        return this.#description;
    }

    public set description(description: string) {
        this.#description = description;
    }


    public get date() {
        return this.#date;
    }

    public set date(date: Date) {
        this.#date = date;
    }


    public get startTime() {
        return this.#startTime;
    }

    public set startTime(startTime: number) {
        if (0 <= startTime && startTime <= 24 && startTime <= this.#endTime) {
            this.#startTime = +startTime;
        }
    }


    public get endTime() {
        return this.#endTime;
    }

    public set endTime(endTime: number) {
        if (0 <= endTime && endTime <= 24 && endTime >= this.#startTime) {
            this.#endTime = endTime;
        }
    }
}