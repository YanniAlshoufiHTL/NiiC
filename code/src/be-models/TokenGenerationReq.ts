export default interface TokenGenerationReq {
    type: "blm" | "bgm" | "dm" | "mb";
    userId: number;
    write: string[];
    read: string[];
    oldToken: string | null;
}