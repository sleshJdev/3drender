"use strict";

/**
 * Created by slesh on 9/24/15.
 */

var CONSTANTS = Object.create(null);
CONSTANTS.DEGREES_TO_RADIANS = Math.PI / 180;
CONSTANTS.RADIANS_TO_DEGREES = 180 / Math.PI;
CONSTANTS.CANVAS_WIDTH = 1300;
CONSTANTS.CANVAS_HEIGHT = 600;

window.onload = function () {
    var w = CONSTANTS.CANVAS_WIDTH;
    var h = CONSTANTS.CANVAS_HEIGHT;

    var canvas = $("canvas");
    var context = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    var selectedProjection = 0;

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

        //isometric
        var isometricSettings = Util.createSettings(new Vector(w / 2, h - 200, 0));
        var isometricParameters = Util.createParameters(50, 100, 150, 8);

        var orthogonalCone = new Cone(orthogonalParameters);
        var isometricCone = new Cone(isometricParameters);
        return [
            new OrthogonalRenderer(context, orthogonalCone, orthogonalSettings, orthogonalParameters),
            new IsometricRenderer(context, isometricCone, isometricSettings, isometricParameters)
        ];
    })();

    function redraw() {
        context.clearRect(0, 0, w, h);
        renders[selectedProjection].rendering();
    }

    redraw();

    var controller = new Controller();
    controller.afterAction = redraw;

    /*
     rotating
     */
    controller.addListenerForKey(87/*"w"*/, false, false, function () {
        renders[selectedProjection].settings.rotate.x = 10 * CONSTANTS.DEGREES_TO_RADIANS;
    });
    controller.addListenerForKey(83/*"s"*/, false, false, function () {
        renders[selectedProjection].settings.rotate.x = 10 * CONSTANTS.DEGREES_TO_RADIANS;
    });
    controller.addListenerForKey(68/*"d"*/, false, false, function () {
        renders[selectedProjection].settings.rotate.y = 10 * CONSTANTS.DEGREES_TO_RADIANS;
    });
    controller.addListenerForKey(65/*"a"*/, false, false, function () {
        renders[selectedProjection].settings.rotate.y = 10 * CONSTANTS.DEGREES_TO_RADIANS;
    });
    controller.addListenerForKey(69/*"e"*/, false, false, function () {
        renders[selectedProjection].settings.rotate.z = 10 * CONSTANTS.DEGREES_TO_RADIANS;
    });
    controller.addListenerForKey(81/*"q"*/, false, false, function () {
        renders[selectedProjection].settings.rotate.z = 10 * CONSTANTS.DEGREES_TO_RADIANS;
    });

    /*
     scaling
     */
    controller.addListenerForKey(87/*"w"*/, true, false, function () {
        renders[selectedProjection].settings.scale.x = 0.1;
    });
    controller.addListenerForKey(83/*"s"*/, true, false, function () {
        renders[selectedProjection].settings.scale.x = 0.1;
    });
    controller.addListenerForKey(68/*"d"*/, true, false, function () {
        renders[selectedProjection].settings.scale.y = 0.1;
    });
    controller.addListenerForKey(65/*"a"*/, true, false, function () {
        renders[selectedProjection].settings.scale.y = 0.1;
    });
    controller.addListenerForKey(69/*"e"*/, true, false, function () {
        renders[selectedProjection].settings.scale.z = 0.1;
    });
    controller.addListenerForKey(81/*"q"*/, true, false, function () {
        renders[selectedProjection].settings.scale.z = 0.1;
    });

    /*
     translating
     */
    controller.addListenerForKey(39/*arrow-right*/, false, false, function () {
        renders[selectedProjection].settings.translate.x = 10;
    });
    controller.addListenerForKey(37/*arrow-left*/, false, false, function () {
        renders[selectedProjection].settings.translate.x = 10;
    });
    controller.addListenerForKey(38/*arrow-up*/, false, false, function () {
        renders[selectedProjection].settings.translate.y = 10;
    });
    controller.addListenerForKey(40/*arrow-down*/, false, false, function () {
        renders[selectedProjection].settings.translate.y = 10;
    });
    controller.addListenerForKey(38/*arrow-up*/, true, false, function () {
        renders[selectedProjection].settings.translate.z = 10;
    });
    controller.addListenerForKey(40/*arrow-down*/, true, false, function () {
        renders[selectedProjection].settings.translate.z = 10;
    });

    /*
     changing geometry parameters
     */
    controller.addListenerForKey(73/*i*/, false, false, function () {
        renders[selectedProjection].parameters.innerRadius = 5;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(73/*i*/, true, false, function () {
        renders[selectedProjection].parameters.innerRadius = 5;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });

    controller.addListenerForKey(79/*o*/, false, false, function () {
        renders[selectedProjection].parameters.outerRadius = 5;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(79/*o*/, true, false, function () {
        renders[selectedProjection].parameters.outerRadius = 5;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });

    controller.addListenerForKey(76/*l*/, false, false, function () {
        renders[selectedProjection].parameters.height = 5;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(76/*l*/, true, false, function () {
        renders[selectedProjection].parameters.height = 5;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });

    controller.addListenerForKey(78/*n*/, false, false, function () {
        renders[selectedProjection].parameters.majorNumber = 1;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });
    controller.addListenerForKey(78/*n*/, true, false, function () {
        renders[selectedProjection].parameters.majorNumber = 1;
        renders[selectedProjection].settings.isUpdateGeometry = true;
    });

    (function () {
        var projections = [
            "projection-orthogonal",
            "projection-isometric"
        ];
        [49/*1*/, 50/*2*/, 51/*3*/].forEach(function (code, index) {
            controller.addListenerForKey(code, false, true, function () {
                selectedProjection = index;
                redraw();
            });
        });
    })();
};





