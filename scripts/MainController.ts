import { Renderer } from "./renderer";
import { ObjectManager } from "./ObjectManager";
import { Coordinator } from "./Coordinator";
import { IShapeData } from "./ShapeData";


export class MainController implements ng.IController {

    private originalData: any;

    private weapons: IShapeData[];

    public get coordMode(): string {
        return this.coordinator.getMode();
    }

    public set coordMode(val: string) {
        this.coordinator.setMode(val);
    }

    static $inject = ["renderer", "objectManager", "coordinator", "$scope"];

    constructor(
        private renderer: Renderer,
        private objectManager: ObjectManager,
        private coordinator: Coordinator,
        private $scope: ng.IScope
    ) {

    }

    $onInit() {

        this.renderer.setup();
        this.renderer.loadTexture();

        const dataFile = document.getElementById("dataFile");
        dataFile.addEventListener("change", (e) => this.onDataFileUpload(e));

        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Digit1":
                    this.coordinator.setMode("offset");
                    this.$scope.$apply();
                    break;
                case "Digit2":
                    this.coordinator.setMode("center");
                    this.$scope.$apply();
                    break;
                case "Digit3":
                    this.coordinator.setMode("hand1");
                    this.$scope.$apply();
                    break;
                case "Digit4":
                    this.coordinator.setMode("hand2");
                    this.$scope.$apply();
                    break;
                case "Digit5":
                    this.coordinator.setMode("muzzle");
                    this.$scope.$apply();
                    break;
                case "Digit6":
                    this.coordinator.setMode("angle");
                    this.$scope.$apply();
                    break;
            }
        });
    }

    private onDataFileUpload(e: any) {
        var f = e.target.files[0]; // FileList object

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (ev: any) => {
            const data = ev.target.result;
            this.originalData = JSON.parse(data);
            this.applyWeapons(this.originalData.weapons);
            this.$scope.$apply();
        }

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }

    private applyWeapons(weapons: IShapeData[]) {
        this.weapons = weapons;
        this.renderer.clear();

        console.log(this.weapons);
        for (let i = 0; i < this.weapons.length; i++) {
            this.renderer.drawWeapon(this.weapons[i], i);
        }
    }

    public save() {
        let json = JSON.stringify(this.originalData);

        let encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(json);
        let link = document.createElement("a");
        link.setAttribute('href', encodedUri);
        link.setAttribute("download", "shape.json");
        document.body.appendChild(link); // Required for FF

        link.click();
    }
}