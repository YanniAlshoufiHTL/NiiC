export default interface TokenGenerationReq {
    type: "blm" | "bgm" | "dm" | "mb";
    userId: number;
    write: number[];
    read: number[];
    oldToken: string | null;
}