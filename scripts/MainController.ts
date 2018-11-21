import { Renderer } from "./renderer";
import { ObjectManager } from "./ObjectManager";
import { Coordinator } from "./Coordinator";
import ClipboardJS from "clipboard";


export class MainController implements ng.IController {

    private coords: any = {};
    private jsonText = "";
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

        let files = document.getElementById("files");

        files.addEventListener("change", (e) => this.onFileUpload(e));

        let button = new ClipboardJS("#copy", {
            target: () => {
                return document.getElementById("foo");
            }
        })

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
            }
        });
    }

    private onFileUpload(e: any) {
        var files = e.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            let name = f.name;
            if (this.objectManager.has(name)) {
                continue;
            }

            let index = this.objectManager.length();

            this.objectManager.register(name);

            // Closure to capture the file information.
            reader.onload = (ev: any) => {
                let data = ev.target.result;
                this.renderer.draw(name, data, index);
            }

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    public save() {
        this.jsonText = JSON.stringify(this.objectManager.getData());
    }

    public copy() {
    }
}