class CheckingHelpers{
    public static isStringANumber(str: string): boolean{
        return /^\d+$/.test(str);
    }
}