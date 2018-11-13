import { Spritesheet, Sprite, Graphics } from "pixi.js";
import { ObjectManager, CoordObj } from "./ObjectManager";
import { Coordinator } from "./Coordinator";

export class Renderer {

    private app: PIXI.Application;

    readonly scale: number = 8;
    readonly gridSize: number = 30;

    private countInRow: number;

    static $inject = ["objectManager", "coordinator"];

    constructor(
        private objectManager: ObjectManager,
        private coordinator: Coordinator
    ) {
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
            height: window.innerHeight,
        });

        //Add the canvas that Pixi automatically created for you to the HTML document
        document.getElementById("game").appendChild(this.app.view);

        this.app.stage.scale.set(this.scale, this.scale);

        this.countInRow = Math.floor(this.app.view.width / this.scale / this.gridSize);
    }

    public draw(name: string, data: string, index: number) {
        let bt = PIXI.BaseTexture.fromImage(data);
        bt.on("loaded", () => {
            let t = new PIXI.Texture(bt);

            let sprite = new PIXI.Sprite(t);
            sprite.interactive = true;
            sprite.on("mousedown", (e: PIXI.interaction.InteractionEvent) => {
                let localPos = e.data.getLocalPosition(sprite);

                if (this.coordinator.getMode() == null) {
                    console.error("mode null");
                    return;
                }

                this.objectManager.setCoord(name, this.coordinator.getMode(), {
                    x: Math.floor(localPos.x),
                    y: Math.floor(localPos.y),
                });

                sprite.removeChildren();

                this.drawPoints(this.objectManager.getObj(name), sprite);
            });

            let g = new PIXI.Graphics();
            g.lineStyle(1, 0xff0000);
            g.moveTo(0, 0);
            g.lineTo(t.width, 0);
            g.lineTo(t.width, t.height);
            g.lineTo(0, t.height);
            g.closePath();

            let cont = new PIXI.Container();
            cont.addChild(g);
            cont.addChild(sprite);

            let xIndex = index % this.countInRow;
            let yIndex = Math.floor(index / this.countInRow);

            cont.position.set(xIndex * this.gridSize, yIndex * this.gridSize);

            this.app.stage.addChild(cont);
        });
    }

    private drawPoints(obj: CoordObj, sprite: Sprite) {
        for (let k of Object.keys(obj)) {
            let color = this.getPointColor(k);

            let p = obj[k];
            let g = new PIXI.Graphics();
            g.beginFill(color);
            g.moveTo(0, 0);
            g.lineTo(1, 0);
            g.lineTo(1, 1);
            g.lineTo(0, 1);
            g.closePath();
            g.endFill();
            g.position.set(p.x, p.y);
            sprite.addChild(g);
        }
    }

    private getPointColor(mode: string): number {
        switch (mode) {
            case "offset":
                return 0x0000ff;
            case "center":
                return 0x00ff00;
            case "hand1":
                return 0xffb247;
            case "hand2":
                return 0xc49b05;
            case "muzzle":
                return 0xff0000;
        }
    }
}

