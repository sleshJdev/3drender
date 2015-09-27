"use strict";

/**
 * Created by slesh on 9/24/15.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var CANVAS_WIDTH = 900;
    var CANVAS_HEIGHT = 450;

    var log = console.log;
    var cos = Math.cos;
    var sin = Math.sin;

    function $(selector) {
        return document.querySelector(selector);
    }

    var canvas = $("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    var sc = Object.create(null);//system of coordinates
    sc.center = new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, 0);

    var settings = Object.create(null);//settings to rendering of cone
    settings.angle = new Vector(0, 0, 0);
    settings.scale = new Vector(1, 1, 1);
    settings.translate = sc.center.clone();
    settings.isUpdateGeometry = true;

    var parameters = Object.create(null);//parameters for model of cone
    parameters.innerRadius = 100;
    parameters.outerRadius = 200;
    parameters.height = 250
    parameters.majorNumber = 8;
    parameters.colors = Object.create(null);
    parameters.colors.outer = "darkred";
    parameters.colors.inner = "darkgreen";
    parameters.colors.base = "darkblue";

    var cone = new Cone(parameters, sc);
    cone.generateGeometry(parameters);
    var renderer = new Renderer(canvas, cone, settings, parameters);

    function redraw() {
        renderer.rendering();
    };

    new Slider($("#rotate-x-slider"), settings.angle.x, 0, 360, redraw).setChangeListener(function (slider, angleX) {
        settings.angle.x = angleX * DEGREES_TO_RADIANS;
        slider.innerHTML = "&ang;X: " + Math.round(angleX) + "&deg;";
    });
    new Slider($("#rotate-y-slider"), settings.angle.y, 0, 360, redraw).setChangeListener(function (slider, angleY) {
        settings.angle.y = angleY * DEGREES_TO_RADIANS;
        slider.innerHTML = "&ang;Y: " + Math.round(angleY) + "&deg;";
    });
    new Slider($("#rotate-z-slider"), settings.angle.z, 0, 360, redraw).setChangeListener(function (slider, angleZ) {
        settings.angle.z = angleZ * DEGREES_TO_RADIANS;
        slider.innerHTML = "&ang;Z: " + Math.round(angleZ) + "&deg;";
    });

    new Slider($("#translate-x-slider"), settings.translate.x, 0, CANVAS_WIDTH, redraw).setChangeListener(function (slider, translateX) {
        settings.translate.x = translateX;
        slider.innerHTML = "&Delta;X:" + Math.round(translateX) + "px";
    });
    new Slider($("#translate-y-slider"), settings.translate.y, 0, CANVAS_HEIGHT, redraw).setChangeListener(function (slider, translateY) {
        settings.translate.y = translateY;
        slider.innerHTML = "&Delta;Y:" + Math.round(translateY) + "px";
    });
    new Slider($("#translate-z-slider"), settings.translate.z, 0, 300, redraw).setChangeListener(function (slider, translateZ) {
        settings.translate.z = translateZ;
        slider.innerHTML = "&Delta;Z:" + Math.roundtranslateZ + "px";
    });

    new Slider($("#scale-x-slider"), settings.scale.x, 0, 5, redraw).setChangeListener(function (slider, scaleX) {
        settings.scale.x = scaleX;
        slider.innerHTML = "&times;" + scaleX.toFixed(2) + "X";
    });
    new Slider($("#scale-y-slider"), settings.scale.y, 0, 5, redraw).setChangeListener(function (slider, scaleY) {
        settings.scale.y = scaleY;
        slider.innerHTML = "&times;" + scaleY.toFixed(2) + "Y";
    });
    new Slider($("#scale-z-slider"), settings.scale.z, 0, 5, redraw).setChangeListener(function (slider, scaleZ) {
        settings.scale.z = scaleZ;
        slider.innerHTML = "&times;" + scaleZ.toFixed(2) + "Z";
    });

    new Slider($("#major-number-slider"), parameters.majorNumber, 3, 300, redraw).setChangeListener(function (slider, majorNumber) {
        majorNumber = Math.round(majorNumber);
        settings.isUpdateGeometry = parameters.majorNumber != majorNumber;
        parameters.majorNumber = majorNumber;
        slider.innerHTML = majorNumber;
    });
    new Slider($("#inner-radius-slider"), parameters.innerRadius, 5, 250, redraw).setChangeListener(function (slider, innerRadius) {
        parameters.innerRadius = innerRadius;
        slider.innerHTML = "&#8986;" + Math.round(innerRadius) + "px";
    });
    new Slider($("#outer-radius-slider"), parameters.outerRadius, 10, 500, redraw).setChangeListener(function (slider, outerRadius) {
        parameters.outerRadius = outerRadius;
        slider.innerHTML = "&#8986;" + Math.round(outerRadius) + "px";
    });
    new Slider($("#height-slider"), parameters.height, 10, CANVAS_HEIGHT, redraw).setChangeListener(function (slider, height) {
        parameters.height = height;
        slider.innerHTML = "&perp;" + Math.round(height) + "px";
    });
};


