import { IShapeData } from "./ShapeData";
import { Coordinator } from "./Coordinator";
import { Container, Graphics, Sprite } from "pixi.js";
import { Renderer } from "./renderer";

export class WeaponElement {

    private cont: Container;

    private weaponCont: Container;
    private weapon: Sprite;
    private text: Text;

    private hand1Point: Graphics;
    private hand2Point: Graphics;
    private muzzlePoint: Graphics;

    private offsetDragging: boolean;
    private centerDragging: boolean;
    private angleDragging: boolean;

    constructor(
        private shape: IShapeData,
        private coordinator: Coordinator,
    ) {
        this.createShape();
    }

    public locate(x: number, y: number) {
        console.log(x, y);
        this.cont.position.set(x, y);
    }

    public getCont() {
        return this.cont;
    }

    private createShape() {
        let sprite = new PIXI.Sprite(this.getTexture(this.shape.image));
        sprite.interactive = true;
        sprite.on("mousedown", (e: PIXI.interaction.InteractionEvent) => {
            let localPos = e.data.getLocalPosition(sprite);

            this.handleMouseDown(localPos);
        });

        sprite.on('mouseup', () => this.handleMouseUp())
        sprite.on('mouseupoutside', () => this.handleMouseUp())
        sprite.on('mousemove', (e: any) => {
            const parent = this.offsetDragging ? sprite.parent.parent : sprite.parent
            let localPos = e.data.getLocalPosition(parent);
            this.onDragMove(localPos)
        });
        this.weapon = sprite;
        let g = new PIXI.Graphics();
        g.lineStyle(0.25, 0xff0000);
        g.moveTo(0, 0);
        g.lineTo(sprite.width, 0);
        g.lineTo(sprite.width, sprite.height);
        g.lineTo(0, sprite.height);
        g.closePath();
        this.weaponCont = new PIXI.Container();
        this.weaponCont.addChild(
            sprite
        );
        this.weaponCont.addChild(g);
        this.weaponCont.addChild(this.createPoint(0xff0000, { x: 0, y: 0 }));

        let text = new PIXI.Text(this.shape.name, {
            fontSize: 20,
            fill: 0xffffff
        });
        text.scale.set(1 / 8);
        text.position.set(0, -14);

        let playerImage = new PIXI.Sprite(PIXI.utils.TextureCache["player/idle/right/a1_0.png"]);
        playerImage.anchor.set(0.5);

        let cont = new PIXI.Container();
        cont.addChild(playerImage)
        cont.addChild(text);
        cont.addChild(this.weaponCont);

        this.cont = cont;

        this.drawOffset(this.shape.offset);
        this.drawCenter(this.shape.center);
        this.drawHand1(this.shape.hand1);
        this.drawHand2(this.shape.hand2);
        this.drawMuzzle(this.shape.muzzle);
        this.weapon.rotation = (this.shape.angle || 0) / 180 * Math.PI;
    }

    private handleMouseDown(pos: { x: number, y: number }) {
        if (this.coordinator.getMode() == null) {
            console.error("mode null");
            return;
        }

        const x = Math.floor(pos.x)
        const y = Math.floor(pos.y);
        switch (this.coordinator.getMode()) {
            case "offset":
                this.offsetDragging = true;
                break;
            case "center":
                this.centerDragging = true;
                break;
            case "hand1":
                this.drawHand1({ x, y });
                this.shape.hand1 = { x, y };
                break;
            case "hand2":
                this.drawHand2({ x, y });
                this.shape.hand2 = { x, y };
                break;
            case "muzzle":
                this.drawMuzzle({ x, y });
                this.shape.muzzle = { x, y };
                break;
            case "angle":
                this.angleDragging = true;
                break;
        }
    }

    private handleMouseUp() {
        this.offsetDragging = false;
        this.centerDragging = false;
        this.angleDragging = false;
    }
    private onDragMove(pos: { x: number, y: number }) {
        const x = Math.floor(pos.x);
        const y = Math.floor(pos.y);
        if (this.offsetDragging) {
            this.weaponCont.position.set(x, y);
            this.shape.offset = { x, y };
        }

        if (this.centerDragging) {
            const cx = -x + Math.floor(this.weapon.texture.width / 2);
            const cy = -y + Math.floor(this.weapon.texture.height / 2);
            this.weapon.anchor.set(
                cx / this.weapon.texture.width,
                cy / this.weapon.texture.height
            );
            // this.weapon.position.set(x, y);
            this.shape.center = { x: cx, y: cy };
        }

        if (this.angleDragging) {
            const angle = Math.atan2(pos.y, pos.x) / Math.PI * 180;

            const result = Math.floor(angle / 15) * 15;
            this.weapon.rotation = result / 180 * Math.PI;
            this.shape.angle = result;
        }
    }

    private createPoint(color: number, p: { x: number, y: number }) {
        let g = new PIXI.Graphics();
        g.lineStyle(0.2, 0xffffff)
        g.beginFill(color);
        g.moveTo(0, 0);
        g.lineTo(1, 0);
        g.lineTo(1, 1);
        g.lineTo(0, 1);
        g.closePath();
        g.endFill();
        g.position.set(p.x, p.y);
        return g;
    }

    private getTexture(path: string) {
        return PIXI.utils.TextureCache[path];
    }

    private drawOffset(pos: { x: number, y: number }) {
        this.weaponCont.position.set(pos.x, pos.y);
    }

    private drawCenter(pos: { x: number, y: number }) {
        this.weapon.anchor.set(
            pos.x / this.weapon.texture.width,
            pos.y / this.weapon.texture.height
        );
    }

    private drawHand1(pos: { x: number, y: number }) {
        if (this.hand1Point) {
            this.hand1Point.destroy();
        }
        if (!pos) return;
        const point = this.createPoint(0xffb247, pos);
        this.hand1Point = point;
        this.weapon.addChild(point);
    }
    private drawHand2(pos: { x: number, y: number }) {
        if (this.hand2Point) {
            this.hand2Point.destroy();
        }
        if (!pos) return;
        const point = this.createPoint(0xc49b05, pos);
        this.hand2Point = point;
        this.weapon.addChild(point);
    }
    private drawMuzzle(pos: { x: number, y: number }) {
        if (this.muzzlePoint) {
            this.muzzlePoint.destroy();
        }
        if (!pos) return;
        const point = this.createPoint(0xff0000, pos);
        this.muzzlePoint = point;
        this.weapon.addChild(point);
    }
}