import * as PIXI from "pixi.js";
import ng from "angular";
import "@uirouter/angularjs";
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-cookies';
import "angular-material";
import { MainController } from "./MainController";
import { Renderer } from "./renderer";
import { Coordinator } from "./Coordinator";
import { StateProvider, StateService } from "@uirouter/angularjs";
import { ObjectManager } from "./ObjectManager";
import "clipboard";

declare var require: any;
require("../stylesheets/style.scss");
require("../node_modules/angular-material/angular-material.min.css");

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let app = ng.module("drApp", ['ui.router', 'ngMaterial', 'ngMessages', 'ngCookies']);

app.controller("mainController", MainController);

app.service("renderer", Renderer);
app.service("coordinator", Coordinator);
app.service("objectManager", ObjectManager);

app.config(['$stateProvider', '$locationProvider', '$httpProvider', 
    ($stateProvider: StateProvider,
        $locationProvider: angular.ILocationProvider,
        $httpProvider: angular.IHttpProvider
    ) => {
        $locationProvider.html5Mode(true);

        $httpProvider.defaults.withCredentials = true

        var main = {
            name: "main",
            templateUrl: 'main.html',
            controller: "mainController",
            controllerAs: "c",
        }

        $stateProvider.state(main);
    }]);

app.run(['$rootScope', '$state', '$window', ($rootScope: ng.IRootScopeService, $state: StateService, $window: ng.IWindowService) => {
    $state.go("main");
}]);