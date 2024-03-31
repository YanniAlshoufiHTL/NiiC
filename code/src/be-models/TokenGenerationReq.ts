export default interface TokenGenerationReq {
    type: "blm" | "bgm" | "dm" | "mb";
    write: number[];
    read: number[];
    oldToken: string | null;
}