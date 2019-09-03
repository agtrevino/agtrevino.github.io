(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var routes = [];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container\">\r\n  <nav id=\"navbar\" class=\"navbar fade-in one\">\r\n    <div class=\"mx-auto\" id=\"navbarNav\">\r\n      <ul class=\"navbar-nav\">\r\n        <li class=\"nav-item\">\r\n          <a class=\"nav-link\" href=\"#\">Home <span class=\"sr-only\">(current)</span></a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n          <a class=\"nav-link\" href=\"#my-projects\">Projects</a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n          <a class=\"nav-link\" href=\"#resume\">Resume</a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n          <a class=\"nav-link\" href=\"#\">Contact</a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </nav>\r\n\r\n  <div class=\"vertical-text\">\r\n    <span>Aaron G. Trevino</span>\r\n  </div>\r\n  <div id=\"home\" class=\"row main \" style=\"margin: 0 !important;\">\r\n    <div class=\"col-md-12 name-title fade-in two\">\r\n      <h1 style=\"font-family: 'slim';\">AARON</h1>\r\n    </div>\r\n    <div class=\"col-md-12 name-title fade-in two\">\r\n      <h1 style=\"margin-top: -22px !important;\">TREVINO</h1>\r\n    </div>\r\n    <div class=\"intro-paragraph \">\r\n      <p class=\"fade-in two\">\r\n        I am a full-stack developer with a focus on providing <span class=\"intro-word-highlight\">unique</span> user\r\n        experiences.\r\n        I'm always looking forward to expanding my knowledge and improving my existing skills.\r\n        I excel at <span class=\"intro-word-highlight\">creative</span> problem solving and critical thinking.\r\n      </p>\r\n      <br>\r\n      <img  style=\"    height: 500px;\r\n      position: absolute;\r\n      left: 460px;\"\r\n        src=\" /assets/img/signature/aaron_sig.gif\">\r\n    </div>\r\n\r\n  </div>\r\n</div>\r\n<div style=\"min-height: 100vh; background:#202020;\">\r\n  <div id=\"my-projects\" class=\"row main\" style=\"margin: 0 !important;\">\r\n    <div class=\"col-md-12 project-title\">\r\n      <h1 style=\"font-family: 'slim';\">My</h1>\r\n    </div>\r\n    <div class=\"col-md-12 project-title\">\r\n      <h1 style=\"margin-top: -22px !important;\">Projects</h1>\r\n    </div>\r\n    <div class=\"row\" style=\"width: 100%\">\r\n      <div class=\"col-md-6\" style=\"height: 460px;\">\r\n        <div class=\"video slide-right\" style=\"position: absolute; top: 60px; width: 85%;\">\r\n          <video class=\" slide-right\" loop preload=\"none\" style=\"width: 85%;\" poster=\"../assets/videos/artgallery.PNG\"\r\n            controls>\r\n            <source src=\"../assets/videos/2019-08-28 15-58-10.mp4\" type=\"video/mp4\">\r\n            <source src=\"movie.ogg\" type=\"video/ogg\">\r\n            Your browser does not support the video tag.\r\n          </video>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6 art-text-fade-in\" style=\"padding-top: 60px\">\r\n        <h2 style=\"font-family: 'avenirSemiBold'; color: #eb3b5a;\">Art Gallery Project</h2>\r\n        <p class=\"project-text-right\">\r\n          A website I've designed and developed for an art collector looking to sell pieces\r\n          from their collection.\r\n        </p>\r\n      </div>\r\n    </div>\r\n    <div class=\"spacer-row\">\r\n\r\n    </div>\r\n    <div class=\"row\" style=\"width: 100%; height: 400px;\">\r\n      <div class=\"col-md-6 jstorm-logo-fade-in\" style=\"padding-top: 60px\">\r\n        <h2 style=\"font-family: 'avenirSemiBold'; color: #eb3b5a; text-align: right;\">J.Storm Logo Design</h2>\r\n        <p class=\"project-text\">\r\n          Logo created for Jeremy Lin's professional <br>Esports organization, J.Storm.\r\n        </p>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <div class=\"slide-up\">\r\n          <img class=\"slide-up\" style=\"width: 85%; position: absolute; right: 15px;\"\r\n            src=\"../assets/img/jstorm-logo/j.storm-logo-wht.png\">\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"spacer-row\">\r\n\r\n    </div>\r\n    <div class=\"row\" style=\"width: 100%; height: 450px;\">\r\n      <div class=\"col-md-6 jstorm-logo-fade-in\" style=\"\">\r\n        <div class=\"\" style=\"position: absolute; left: 15px;\">\r\n          <img style=\"width: 85%; \" src=\"../assets/img/background/dontfeed.PNG\">\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <h2 style=\"font-family: 'avenirSemiBold'; color: #eb3b5a; text-align: left;\">Competetive Gaming League Project\r\n        </h2>\r\n        <p class=\"project-text-right\">\r\n          A collaborative passion project for my friends and I. This a website for creating, managing and playing in\r\n          competetive leagues for multiple videogames.\r\n        </p>\r\n\r\n      </div>\r\n    </div>\r\n    <div class=\"spacer-row\">\r\n\r\n    </div>\r\n    <div class=\"row\" style=\"width: 100%; height: 400px;\">\r\n      <div class=\"col-md-6 jstorm-logo-fade-in\" style=\"padding-top: 60px\">\r\n        <h2 style=\"font-family: 'avenirSemiBold'; color: #eb3b5a; text-align: right;\">Bracket Studio Logo Design</h2>\r\n        <p class=\"project-text\">\r\n          Logo created for the YouTube channel, Bracket Studio.\r\n        </p>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <div class=\"\" style=\"position: absolute; right: 15px;\">\r\n          <img style=\"height: 400px;\" src=\"../assets/img/background/Flat Design BS Logo.png\">\r\n          <!-- <img style=\"height: 500px;\" src=\"../assets/img/jstorm-logo/j.storm-logo-blk.png\"> -->\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"spacer-row\">\r\n\r\n    </div>\r\n    <div class=\"row\" style=\"width: 100%\">\r\n      <div class=\"col-md-6\" style=\"height: 460px;\">\r\n        <div class=\"video slide-right\" style=\"position: absolute; top: 60px; width: 85%;\">\r\n          <video class=\" slide-right\" loop preload=\"none\" style=\"width: 85%;\" controls poster=\"../assets/img/background/ionic.JPG\">\r\n            <source src=\"../assets/videos/2019-08-30 10-50-35.mp4\" type=\"video/mp4\" >\r\n            <source src=\"movie.ogg\" type=\"video/ogg\">\r\n            Your browser does not support the video tag.\r\n          </video>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6 art-text-fade-in\" style=\"padding-top: 60px\">\r\n        <h2 style=\"font-family: 'avenirSemiBold'; color: #eb3b5a;\">Ionic Capstone Project</h2>\r\n        <p class=\"project-text-right\">\r\n          A login page I created for my final capstone project while attending Codeup.\r\n        </p>\r\n      </div>\r\n    </div>\r\n    <div class=\"spacer-row\">\r\n\r\n    </div>\r\n    <div class=\"row\" style=\"width: 100%; height: 400px;\">\r\n      <div class=\"col-md-6 jstorm-logo-fade-in\" style=\"padding-top: 60px\">\r\n        <h2 style=\"font-family: 'avenirSemiBold'; color: #eb3b5a; text-align: right;\">Button Mosh Logo Design</h2>\r\n        <p class=\"project-text\">\r\n          Logo created for a videogame called Button Mosh, currently in development.\r\n        </p>\r\n      </div>\r\n      <div class=\"col-md-6\">\r\n        <div class=\"\" style=\"position: absolute; right: 15px;\">\r\n          <img style=\"height: 400px;\" src=\"../assets/img/background/output-onlinepngtools.png\">\r\n          <!-- <img style=\"height: 500px;\" src=\"../assets/img/jstorm-logo/j.storm-logo-blk.png\"> -->\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"spacer-row\">\r\n\r\n    </div>\r\n\r\n  </div>\r\n</div>\r\n\r\n<div style=\"min-height: 100%; background:#202020;\">\r\n  <div id=\"resume\" class=\"row main\" style=\"margin: 0 !important;\">\r\n    <div class=\"col-md-12 name-title\">\r\n      <h1 style=\"font-family: 'slim';\">My</h1>\r\n    </div>\r\n    <div class=\"col-md-12 name-title\">\r\n      <h1 style=\"margin-top: -22px !important;\">Resume</h1>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\" style=\"width: 100%;\">\r\n    <div class=\"col-md-6\">\r\n      <img style=\"width: 85%; position: absolute; right: 15px;\" src=\"../assets/img/aarongtrevinoresume2020.png \">\r\n    </div>\r\n    <div class=\"col-md-6>\">\r\n      <h2 style=\"font-family: 'big'; color: #eb3b5a; text-align: left;\">Why you should hire ya boi</h2>\r\n      <p class=\"project-text-right\">\r\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore\r\n        magna aliqua.\r\n        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\r\n        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\r\n        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\r\n      </p>\r\n      <br>\r\n      <a href=\"../assets/aarongtrevinoresume2020.pdf\" style=\"float: left;\" download=\"Aaron G Trevino Resume 2019.pdf\">\r\n        <button type=\"button\" class=\"btn\"\r\n          style=\"background: #eb3b5a; color: #fefefe; font-weight: bold; letter-spacing: 4px; padding-bottom: 10px;\">\r\n          <i class=\"fa fa-download\"></i>\r\n          Download PDF\r\n        </button>\r\n      </a>\r\n    </div>\r\n  </div>\r\n  <div class=\"spacer-row\">\r\n\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n<!-- <router-outlet></router-outlet> -->"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);



var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'portfolio';
    }
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());

jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scroll(function () {
    var scroll = jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scrollTop();
    if (scroll < 100) {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.navbar').css('background', 'transparent');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.navbar').css('transition', '500ms');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.navbar').css('height', '80px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.nav-item').css('margin', ' 0px 15px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.nav-item').css('transition', '500ms');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.vertical-text').css('opacity', '0');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.vertical-text').css('transition', '600ms');
    }
    else {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.navbar').css('background', 'rgba(0, 0, 0, 0.5)');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.navbar').css('transition', '500ms');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.navbar').css('height', '60px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.nav-item').css('margin', ' 0px 30px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.nav-item').css('transition', '500ms');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.vertical-text').css('opacity', '1');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.vertical-text').css('transition', '600ms');
    }
    jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scroll(function () {
        if (scroll < 500) {
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.art-text-fade-in').css('opacity', '0');
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.art-text-fade-in').css('transition', '1200ms');
        }
        else {
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.art-text-fade-in').css('opacity', '1');
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.art-text-fade-in').css('transition', '1200ms');
        }
    });
    jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scroll(function () {
        if (scroll < 800) {
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.jstorm-logo-fade-in').css('opacity', '0');
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.jstorm-logo-fade-in').css('transition', '600ms');
        }
        else {
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.jstorm-logo-fade-in').css('opacity', '1');
            jquery__WEBPACK_IMPORTED_MODULE_2___default()('.jstorm-logo-fade-in').css('transition', '600ms');
        }
    });
});
jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scroll(function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_2___default()(this).scrollTop() > 120) {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-right').css('left', '15px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-right').css('opacity', '1');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-right').css('transition', '600ms');
    }
    else {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-right').css('left', '-700px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-right').css('opacity', '0');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-right').css('transition', '600ms');
    }
});
jquery__WEBPACK_IMPORTED_MODULE_2___default()(window).scroll(function () {
    if (jquery__WEBPACK_IMPORTED_MODULE_2___default()(this).scrollTop() > 160) {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-up').css('top', '-90px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-up').css('opacity', '1');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-up').css('transition', '600ms');
    }
    else {
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-up').css('top', '700px');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-up').css('opacity', '1');
        jquery__WEBPACK_IMPORTED_MODULE_2___default()('.slide-up').css('transition', '600ms');
    }
});


/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _main_nav_main_nav_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./main-nav/main-nav.component */ "./src/app/main-nav/main-nav.component.ts");







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
                _main_nav_main_nav_component__WEBPACK_IMPORTED_MODULE_6__["MainNavComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/main-nav/main-nav.component.css":
/*!*************************************************!*\
  !*** ./src/app/main-nav/main-nav.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4tbmF2L21haW4tbmF2LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/main-nav/main-nav.component.html":
/*!**************************************************!*\
  !*** ./src/app/main-nav/main-nav.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  main-nav works!\n</p>\n"

/***/ }),

/***/ "./src/app/main-nav/main-nav.component.ts":
/*!************************************************!*\
  !*** ./src/app/main-nav/main-nav.component.ts ***!
  \************************************************/
/*! exports provided: MainNavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainNavComponent", function() { return MainNavComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var MainNavComponent = /** @class */ (function () {
    function MainNavComponent() {
    }
    MainNavComponent.prototype.ngOnInit = function () {
    };
    MainNavComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-main-nav',
            template: __webpack_require__(/*! ./main-nav.component.html */ "./src/app/main-nav/main-nav.component.html"),
            styles: [__webpack_require__(/*! ./main-nav.component.css */ "./src/app/main-nav/main-nav.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], MainNavComponent);
    return MainNavComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\aaron.trevino\Documents\GitHub\portfolio\portfolio\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map