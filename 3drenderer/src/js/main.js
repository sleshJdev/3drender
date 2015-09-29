"use strict";

/**
 * Created by slesh on 9/24/15.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var CANVAS_WIDTH = 1300;
    var CANVAS_HEIGHT = 450;
    var Z_INDEX = 300;

    var log = console.log;
    var cos = Math.cos;
    var sin = Math.sin;

    var selectedProjection = 0;

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    var canvas = $("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext("2d");

    var settings = [
        Util.createSettings(new Vector(300, CANVAS_HEIGHT - 200, 0)),
        Util.createSettings(new Vector(900, CANVAS_HEIGHT - 200, 0))
    ];

    var parameters = [
        Util.createParameters(50, 100, 150, 8),
        Util.createParameters(50, 100, 150, 8)
    ];

    var cones = [
        new Cone(parameters[0], settings[0].translate.clone()),
        new Cone(parameters[1], settings[1].translate.clone())
    ];

    var renders = [
        new Renderer(context, cones[0], settings[0], parameters[0]),
        new Renderer(context, cones[1], settings[1], parameters[1])
    ];

    function redraw() {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        renders.forEach(function (render) {
            render.rendering();
        });
    }

    var projectionSwitcher = (function () {
        var projectionNumbersMap = Object.create(null);
        projectionNumbersMap["projection-1"] = 0;
        projectionNumbersMap["projection-2"] = 1;

        return function (projection) {
            selectedProjection = projectionNumbersMap[projection.target.id];
            var divs = $$(".projections div");
            for (var i = 0; i < divs.length; ++i) {
                $("#" + divs.item(i).id).style.backgroundColor = "white";
            }
            projection.target.style.backgroundColor = "lightgray";
            updateSliders();
        }
    })();

    $("#projection-1").addEventListener("click", projectionSwitcher);
    $("#projection-2").addEventListener("click", projectionSwitcher);

    /*initialize slider for control panel. FUCK, there is a lot of them*/
    var sliders = [];

    function updateSliders() {
        sliders.forEach(function (slider) {
            slider.notify();
        });
    }

    sliders.push(new Slider($("#rotate-x-slider"), function () {
        return Math.round(settings[selectedProjection].angle.x * RADIANS_TO_DEGREES);
    }, 0, 360, redraw).setChangeListener(function (slider, angleX) {
            settings[selectedProjection].angle.x = angleX * DEGREES_TO_RADIANS;
            slider.innerHTML = "&ang;X: " + Math.round(angleX) + "&deg;";
        }));

    sliders.push(new Slider($("#rotate-y-slider"), function () {
        return Math.round(settings[selectedProjection].angle.y * RADIANS_TO_DEGREES);
    }, 0, 360, redraw).setChangeListener(function (slider, angleY) {
            settings[selectedProjection].angle.y = angleY * DEGREES_TO_RADIANS;
            slider.innerHTML = "&ang;Y: " + Math.round(angleY) + "&deg;";
        }));
    sliders.push(new Slider($("#rotate-z-slider"), function () {
        return Math.round(settings[selectedProjection].angle.z * RADIANS_TO_DEGREES);
    }, 0, 360, redraw).setChangeListener(function (slider, angleZ) {
            settings[selectedProjection].angle.z = angleZ * DEGREES_TO_RADIANS;
            slider.innerHTML = "&ang;Z: " + Math.round(angleZ) + "&deg;";
        }));

    sliders.push(new Slider($("#translate-x-slider"), function () {
        return settings[selectedProjection].translate.x;
    }, 0, CANVAS_WIDTH, redraw).setChangeListener(function (slider, translateX) {
            settings[selectedProjection].translate.x = translateX;
            slider.innerHTML = "&Delta;X:" + Math.round(translateX) + "px";
        }));
    sliders.push(new Slider($("#translate-y-slider"), function () {
        return settings[selectedProjection].translate.y;
    }, 0, CANVAS_HEIGHT, redraw).setChangeListener(function (slider, translateY) {
            settings[selectedProjection].translate.y = translateY;
            slider.innerHTML = "&Delta;Y:" + Math.round(translateY) + "px";
        }));

    sliders.push(new Slider($("#translate-z-slider"), function () {
        return settings[selectedProjection].translate.z;
    }, 0, Z_INDEX, redraw).setChangeListener(function (slider, translateZ) {
            settings[selectedProjection].translate.z = translateZ;
            settings[selectedProjection].scale.x =
                settings[selectedProjection].scale.y =
                    settings[selectedProjection].scale.z = (Z_INDEX - translateZ) / Z_INDEX;
            slider.innerHTML = "&Delta;Z:" + Math.round(translateZ) + "px";
        }));

    sliders.push(new Slider($("#scale-x-slider"), function () {
        return settings[selectedProjection].scale.x;
    }, 0, 5, redraw).setChangeListener(function (slider, scaleX) {
            settings[selectedProjection].scale.x = scaleX;
            slider.innerHTML = "&times;" + scaleX.toFixed(2) + "X";
        }));
    sliders.push(new Slider($("#scale-y-slider"), function () {
        return settings[selectedProjection].scale.y;
    }, 0, 5, redraw).setChangeListener(function (slider, scaleY) {
            settings[selectedProjection].scale.y = scaleY;
            slider.innerHTML = "&times;" + scaleY.toFixed(2) + "Y";
        }));
    sliders.push(new Slider($("#scale-z-slider"), function () {
        return settings[selectedProjection].scale.z;
    }, 0, 5, redraw).setChangeListener(function (slider, scaleZ) {
            settings[selectedProjection].scale.z = scaleZ;
            slider.innerHTML = "&times;" + scaleZ.toFixed(2) + "Z";
        }));

    sliders.push(new Slider($("#major-number-slider"), function () {
        return parameters[selectedProjection].majorNumber;
    }, 3, 300, redraw).setChangeListener(function (slider, majorNumber) {
            majorNumber = Math.round(majorNumber);
            settings[selectedProjection].isUpdateGeometry = true;
            parameters[selectedProjection].majorNumber = majorNumber;
            slider.innerHTML = majorNumber;
        }));
    sliders.push(new Slider($("#inner-radius-slider"), function () {
        return parameters[selectedProjection].innerRadius;
    }, 5, 250, redraw).setChangeListener(function (slider, innerRadius) {
            parameters[selectedProjection].innerRadius = innerRadius;
            settings[selectedProjection].isUpdateGeometry = true;
            slider.innerHTML = "&#8986;" + Math.round(innerRadius) + "px";
        }));
    sliders.push(new Slider($("#outer-radius-slider"), function () {
        return parameters[selectedProjection].outerRadius;
    }, 10, 500, redraw).setChangeListener(function (slider, outerRadius) {
            parameters[selectedProjection].outerRadius = outerRadius;
            settings[selectedProjection].isUpdateGeometry = true;
            slider.innerHTML = "&#8986;" + Math.round(outerRadius) + "px";
        }));
    sliders.push(new Slider($("#height-slider"), function () {
        return parameters[selectedProjection].height;
    }, 10, CANVAS_HEIGHT, redraw).setChangeListener(function (slider, height) {
            parameters[selectedProjection].height = height;
            settings[selectedProjection].isUpdateGeometry = true;
            slider.innerHTML = "&perp;" + Math.round(height) + "px";
        }));


    redraw();
};


