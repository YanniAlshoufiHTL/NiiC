class NiicEvent extends NiicAet {
    public aetTypeName = "Event";
    public aetTypeNamePlural = `${this.aetTypeName}s`;

    public constructor(title: string, startTime: number, endTime: number, description: string, date: Date, aetTypeNamePlural: string) {
        super(title, startTime, endTime, description, date);
        this.aetTypeNamePlural = aetTypeNamePlural;
    }
}
