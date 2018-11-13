

export class Coordinator {

    private mode: string;

    public setMode(mode: string) {
        this.mode = mode;
    }

    public getMode(): string {
        return this.mode;
    }
}