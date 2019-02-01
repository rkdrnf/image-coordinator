import { Sprite } from "pixi.js";
import { ObjectManager, CoordObj } from "./ObjectManager";
import { Coordinator } from "./Coordinator";
import { IShapeData } from "./ShapeData";
import { WeaponElement } from "./WeaponElement";

export class Renderer {

    private app: PIXI.Application;

    readonly scale: number = 8;
    readonly gridSize: number = 30;

    private countInRow: number;

    private weapons: WeaponElement[];

    static $inject = ["objectManager", "coordinator"];

    constructor(
        private objectManager: ObjectManager,
        private coordinator: Coordinator
    ) {
        this.weapons = [];
    }

    public setup() {
        this.app = new PIXI.Application({
            backgroundColor: 0x111111,
            antialias: false,    // default: false
            transparent: false, // default: false
            autoResize: true,
            resolution: 1,
            roundPixels: true,
            width: window.innerWidth - 250,
            height: 1400,
        });

        //Add the canvas that Pixi automatically created for you to the HTML document
        document.getElementById("game").appendChild(this.app.view);

        this.app.stage.scale.set(this.scale, this.scale);

        this.countInRow = Math.floor(this.app.view.width / this.scale / this.gridSize);
    }

    public loadTexture() {
        PIXI.loader
            .add("../resources/textures/atlas.json")
            .load(() => {
            }).on("error", e => {
                console.error(e);
            });
    }

    public draw(name: string, data: string, index: number) {
    }

    public drawWeapon(d: IShapeData, index: number) {
        const w = new WeaponElement(d, this.coordinator);
        this.weapons.push(w);

        let xIndex = index % this.countInRow;
        let yIndex = Math.floor(index / this.countInRow);

        w.locate(16 + xIndex * this.gridSize, 16 + yIndex * this.gridSize);
        this.app.stage.addChild(w.getCont());
    }

    public clear() {
        this.app.stage.removeChildren();
        this.weapons = [];
    }


}

