export default interface NiicBlockModuleNoId {
    token: string,
    title: string,
    description: string | null,
    type: "blm",
    html: string | null,
    css: string | null,
    js: string | null,
    published:boolean
}