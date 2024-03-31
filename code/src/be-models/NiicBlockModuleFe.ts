export default interface NiicBlockModuleFe {
    id: number,
    title: string,
    description: string | null,
    type: "blm",
    html: string | null,
    css: string | null,
    js: string | null,
}