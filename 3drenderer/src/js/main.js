"use strict";

/**
 * Created by slesh on 9/24/15.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var CANVAS_WIDTH = 1300;
    var CANVAS_HEIGHT = 450;

    var canvas = $("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext("2d");

    var selectedProjection = 1;

    var log = console.log;
    var cos = Math.cos;
    var sin = Math.sin;

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    var renders = (function () {
        //orthogonal
        var orthogonalParameters = Util.createParameters(50, 100, 150, 8);
        var orthogonalSettings = Util.createSettings(new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 300, 350));
        //isometric
        var isometricSettings = Util.createSettings(new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, 0));
        var isometricParameters = Util.createParameters(50, 100, 150, 8);

        var orthogonalCone = new Cone(orthogonalParameters);
        var isometricCone = new Cone(isometricParameters);
        return [
            new OrthogonalRenderer(context, orthogonalCone, orthogonalSettings, orthogonalParameters),
            new IsometricRenderer(context, isometricCone, isometricSettings, isometricParameters)
        ];
    })();

    function redraw() {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        renders[selectedProjection].rendering();
    }

    (function (projections) {
        var projectionNumbersMap = Object.create(null);
        projections.forEach(function (name, index) {
            $("#" + name).addEventListener("click", handler);
            projectionNumbersMap[name] = index;
        });
        $("#" + projections[selectedProjection]).style.backgroundColor = "lightgray";

        function handler(projection) {
            selectedProjection = projectionNumbersMap[projection.target.id];
            var divs = $$(".projections div");
            for (var i = 0; i < divs.length; ++i) {
                $("#" + divs.item(i).id).style.backgroundColor = "white";
            }
            projection.target.style.backgroundColor = "lightgray";
            updateSliders();
            redraw();
        }
    })([
        "projection-orthogonal",
        "projection-isometric"
    ]);

    /*initialize slider for control panel. FUCK, there is a lot of them*/
    var sliders = [];

    function updateSliders() {
        sliders.forEach(function (slider) {
            slider.notify();
        });
    }

    sliders.push(new Slider($("#rotate-x-slider"), function () {
        return Math.round(renders[selectedProjection].settings.rotate.x * RADIANS_TO_DEGREES);
    }, 0, 360, redraw).setChangeListener(function (slider, angleX) {
            renders[selectedProjection].settings.rotate.x = angleX * DEGREES_TO_RADIANS;
            slider.innerHTML = "&ang;X: " + Math.round(angleX) + "&deg;";
        }));

    sliders.push(new Slider($("#rotate-y-slider"), function () {
        return Math.round(renders[selectedProjection].settings.rotate.y * RADIANS_TO_DEGREES);
    }, 0, 360, redraw).setChangeListener(function (slider, angleY) {
            renders[selectedProjection].settings.rotate.y = angleY * DEGREES_TO_RADIANS;
            slider.innerHTML = "&ang;Y: " + Math.round(angleY) + "&deg;";
        }));
    sliders.push(new Slider($("#rotate-z-slider"), function () {
        return Math.round(renders[selectedProjection].settings.rotate.z * RADIANS_TO_DEGREES);
    }, 0, 360, redraw).setChangeListener(function (slider, angleZ) {
            renders[selectedProjection].settings.rotate.z = angleZ * DEGREES_TO_RADIANS;
            slider.innerHTML = "&ang;Z: " + Math.round(angleZ) + "&deg;";
        }));

    sliders.push(new Slider($("#translate-x-slider"), function () {
        return renders[selectedProjection].settings.translate.x;
    }, 0, 1000, redraw).setChangeListener(function (slider, translateX) {
            renders[selectedProjection].settings.translate.x = translateX;
            slider.innerHTML = "&Delta;X:" + Math.round(translateX) + "px";
        }));
    sliders.push(new Slider($("#translate-y-slider"), function () {
        return renders[selectedProjection].settings.translate.y;
    }, 0, 1000, redraw).setChangeListener(function (slider, translateY) {
            renders[selectedProjection].settings.translate.y = translateY;
            slider.innerHTML = "&Delta;Y:" + Math.round(translateY) + "px";
        }));

    sliders.push(new Slider($("#translate-z-slider"), function () {
        return renders[selectedProjection].settings.translate.z;
    }, 0, 1000, redraw).setChangeListener(function (slider, translateZ) {
            renders[selectedProjection].settings.translate.z = translateZ;
            slider.innerHTML = "&Delta;Z:" + Math.round(translateZ) + "px";
        }));

    sliders.push(new Slider($("#scale-x-slider"), function () {
        return renders[selectedProjection].settings.scale.x;
    }, 0, 5, redraw).setChangeListener(function (slider, scaleX) {
            renders[selectedProjection].settings.scale.x = scaleX;
            slider.innerHTML = "&times;" + scaleX.toFixed(2) + "X";
        }));
    sliders.push(new Slider($("#scale-y-slider"), function () {
        return renders[selectedProjection].settings.scale.y;
    }, 0, 5, redraw).setChangeListener(function (slider, scaleY) {
            renders[selectedProjection].settings.scale.y = scaleY;
            slider.innerHTML = "&times;" + scaleY.toFixed(2) + "Y";
        }));
    sliders.push(new Slider($("#scale-z-slider"), function () {
        return renders[selectedProjection].settings.scale.z;
    }, 0, 5, redraw).setChangeListener(function (slider, scaleZ) {
            renders[selectedProjection].settings.scale.z = scaleZ;
            slider.innerHTML = "&times;" + scaleZ.toFixed(2) + "Z";
        }));

    sliders.push(new Slider($("#major-number-slider"), function () {
        return renders[selectedProjection].parameters.majorNumber;
    }, 3, 300, redraw).setChangeListener(function (slider, majorNumber) {
            majorNumber = Math.round(majorNumber);
            renders[selectedProjection].parameters.majorNumber = majorNumber;
            renders[selectedProjection].settings.isUpdateGeometry = true;
            slider.innerHTML = majorNumber;
        }));
    sliders.push(new Slider($("#inner-radius-slider"), function () {
        return renders[selectedProjection].parameters.innerRadius;
    }, 5, 250, redraw).setChangeListener(function (slider, innerRadius) {
            renders[selectedProjection].parameters.innerRadius = innerRadius;
            renders[selectedProjection].settings.isUpdateGeometry = true;
            slider.innerHTML = "&#8986;" + Math.round(innerRadius) + "px";
        }));
    sliders.push(new Slider($("#outer-radius-slider"), function () {
        return renders[selectedProjection].parameters.outerRadius;
    }, 10, 500, redraw).setChangeListener(function (slider, outerRadius) {
            renders[selectedProjection].parameters.outerRadius = outerRadius;
            renders[selectedProjection].settings.isUpdateGeometry = true;
            slider.innerHTML = "&#8986;" + Math.round(outerRadius) + "px";
        }));
    sliders.push(new Slider($("#height-slider"), function () {
        return renders[selectedProjection].parameters.height;
    }, 10, CANVAS_HEIGHT, redraw).setChangeListener(function (slider, height) {
            renders[selectedProjection].parameters.height = height;
            renders[selectedProjection].settings.isUpdateGeometry = true;
            slider.innerHTML = "&perp;" + Math.round(height) + "px";
        }));


    redraw();
};


