"use strict";

/**
 * Created by slesh on 9/24/15.
 */

var CONSTANTS = Object.create(null);
CONSTANTS.d2r = Math.PI / 180;
CONSTANTS.r2d = 180 / Math.PI;
CONSTANTS.CANVAS_WIDTH = 1300;
CONSTANTS.CANVAS_HEIGHT = 600;

window.onload = function () {
    var w = CONSTANTS.CANVAS_WIDTH;
    var h = CONSTANTS.CANVAS_HEIGHT;

    var canvas = $("canvas");
    var context = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    var screen = 0;

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    var renders = (function () {
        //orthogonal
        var orthogonalParameters = Util.createParameters(50, 100, 150, 8);
        var orthogonalSettings = Util.createSettings(new Vector(w / 2, h - 400, 400));
        var orthogonalCone = new Cone(orthogonalParameters);
        return [
            new OrthogonalRenderer(context, orthogonalCone, orthogonalSettings, orthogonalParameters)
        ];
    })();

    function redraw() {
        context.clearRect(0, 0, w, h);
        renders[screen].rendering();
        renders[screen].settings.translate.scale(0);
        renders[screen].settings.rotate.scale(0);
    }

    redraw();

    var controller = new Controller();
    controller.afterAction = redraw;

    /*
     rotating
     */
    controller.addListenerForKey(87/*"w"*/, false, false, function () {
        renders[screen].settings.rotate.x = 10 * CONSTANTS.d2r;
    });
    controller.addListenerForKey(83/*"s"*/, false, false, function () {
        renders[screen].settings.rotate.x = -10 * CONSTANTS.d2r;
    });
    controller.addListenerForKey(68/*"d"*/, false, false, function () {
        renders[screen].settings.rotate.y = 10 * CONSTANTS.d2r;
    });
    controller.addListenerForKey(65/*"a"*/, false, false, function () {
        renders[screen].settings.rotate.y = -10 * CONSTANTS.d2r;
    });
    controller.addListenerForKey(69/*"e"*/, false, false, function () {
        renders[screen].settings.rotate.z = 10 * CONSTANTS.d2r;
    });
    controller.addListenerForKey(81/*"q"*/, false, false, function () {
        renders[screen].settings.rotate.z = -10 * CONSTANTS.d2r;
    });

    /*
     scaling
     */
    controller.addListenerForKey(87/*"w"*/, true, false, function () {
        renders[screen].settings.scale.x += 0.1;
    });
    controller.addListenerForKey(83/*"s"*/, true, false, function () {
        renders[screen].settings.scale.x -= 0.1;
    });
    controller.addListenerForKey(68/*"d"*/, true, false, function () {
        renders[screen].settings.scale.y += 0.1;
    });
    controller.addListenerForKey(65/*"a"*/, true, false, function () {
        renders[screen].settings.scale.y -= 0.1;
    });
    controller.addListenerForKey(69/*"e"*/, true, false, function () {
        renders[screen].settings.scale.z += 0.1;
    });
    controller.addListenerForKey(81/*"q"*/, true, false, function () {
        renders[screen].settings.scale.z -= 0.1;
    });

    /*
     translating
     */
    controller.addListenerForKey(39/*arrow-right*/, false, false, function () {
        renders[screen].settings.translate.x = 10;
    });
    controller.addListenerForKey(37/*arrow-left*/, false, false, function () {
        renders[screen].settings.translate.x = -10;
    });
    controller.addListenerForKey(38/*arrow-up*/, false, false, function () {
        renders[screen].settings.translate.y = -10;
    });
    controller.addListenerForKey(40/*arrow-down*/, false, false, function () {
        renders[screen].settings.translate.y = 10;
    });
    controller.addListenerForKey(38/*arrow-up*/, true, false, function () {
        renders[screen].settings.translate.z = 10;
    });
    controller.addListenerForKey(40/*arrow-down*/, true, false, function () {
        renders[screen].settings.translate.z = -10;
    });

    /*
     changing geometry parameters
     */
    controller.addListenerForKey(73/*i*/, false, false, function () {
        renders[screen].parameters.innerRadius = 5;
        renders[screen].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(73/*i*/, true, false, function () {
        renders[screen].parameters.innerRadius -= 5;
        renders[screen].settings.isUpdateGeometry = true;
    });

    controller.addListenerForKey(79/*o*/, false, false, function () {
        renders[screen].parameters.outerRadius += 5;
        renders[screen].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(79/*o*/, true, false, function () {
        renders[screen].parameters.outerRadius -= 5;
        renders[screen].settings.isUpdateGeometry = true;
    });

    controller.addListenerForKey(76/*l*/, false, false, function () {
        renders[screen].parameters.height += 5;
        renders[screen].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(76/*l*/, true, false, function () {
        renders[screen].parameters.height -= 5;
        renders[screen].settings.isUpdateGeometry = true;
    });

    controller.addListenerForKey(78/*n*/, false, false, function () {
        renders[screen].parameters.majorNumber += 1;
        renders[screen].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(78/*n*/, true, false, function () {
        renders[screen].parameters.majorNumber -= 1;
        renders[screen].settings.isUpdateGeometry = true;
    });
};





