export class Blacklist {
    private _urls: RegExp[];
    private _ids: number[];

    constructor() {
        this._urls = [];
        this._ids = [];
    }

    get urls(): RegExp[] {
        return this._urls;
    }

    setUrls(array: string[]) {
        this._urls = (Array.isArray(array) && array.length > 0) 
            ? this.listToRegex(array) 
            : [];
    }

    get ids(): number[] {
        return this._ids;
    }

    addId = (id: number): void => {
        this._ids.push(id);
    }

    listToRegex = (array: string[]): RegExp[] => {
        return array.map((url: string): RegExp => RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }

    isBlockedUrl = (url: string) => {
        let match = this._urls.find((blockedUrl: RegExp): boolean => blockedUrl.test(url));

        return match !== undefined;
    }

    isBlockedTabId = (id: number) => {
        return this._ids.includes(id);
    }

    clearId = (id: number) => {
        this._ids.splice(this._ids.indexOf(id), 1);
    }

}