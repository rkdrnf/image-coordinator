import { Coordinator } from "./Coordinator";

export interface Vec2 {
    x: number,
    y: number,
}

export interface CoordObj {
    [mode: string]: any
}

export class ObjectManager {


    private map: Map<string, CoordObj>;

    constructor(
    ) {
        this.map = new Map();
    }

    public has(name: string) {
        return this.map.has(name);
    }

    public register(name: string) {
        if (this.map.has(name)) {
            throw new Error("dupcliated");
        }

        this.map.set(name, {});
    }

    public setCoord(name: string, mode: string, coord: Vec2) {
        let d = this.map.get(name);

        d[mode] = coord;
    }

    public getObj(name: string) {
        return this.map.get(name);
    }

    public clear() {
        this.map.clear();
    }

    public length() {
        return this.map.size;
    }

    public getData() {
        return Array.from(this.map.keys()).map((k) => {
            return Object.assign({ name: k }, this.map.get(k));
        });
    }
}