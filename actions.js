"use strict";

/**
 * Created by slesh on 9/24/15.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var CANVAS_WIDTH = 1000;
    var CANVAS_HEIGHT = 500;

    var log = console.log;
    var cos = Math.cos;
    var sin = Math.sin;

    function $(selector) {
        return document.querySelector(selector);
    }

    var canvas = $("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext('2d');

    var sc = Object.create(null);//system of coordinates
    sc.center = new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, 0);

    var parameters = Object.create(null);//parameters for model of conus
    parameters.innerRadius = 100;
    parameters.outerRadius = 200;
    parameters.height = 250
    parameters.innerPoints = 10;
    parameters.outerPoints = 20;

    var settings = Object.create(null);//settings to rendering of conus
    settings.angle = new Vector(0, 0, 0);
    settings.scale = new Vector(1, 1, 1);
    settings.translate = sc.center.clone();

    var cone = new Cone(parameters, sc);
    cone.generatePoints(parameters);
    transform(settings);

    function transform(settings) {
        var rotateX = Matrix.prototype.getRotateXMatrix(settings.angle.x);
        var rotateY = Matrix.prototype.getRotateYMatrix(settings.angle.y);
        var rotateZ = Matrix.prototype.getRotateZMatrix(settings.angle.z);
        var translateToOrigin = Matrix.prototype.getTranslateMatrix(settings.translate.clone().reverse());
        var translateFromOrigin = Matrix.prototype.getTranslateMatrix(settings.translate);
        var transform = Matrix.prototype.multiplyAll(translateFromOrigin, rotateX, rotateY, rotateZ);
        cone.transform(translateToOrigin);
        cone.transform(transform);
        context.clearRect(0, 0, canvas.width, canvas.height);
        cone.draw(context);
    };

    initializeListenerForSlider($("#rotate-x-slider"), settings.angle.x, 360, function (angle) {
        return "&alpha;X: " + angle + "&deg;";
    }, function (angle) {
        settings.angle.x = angle * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#rotate-y-slider"), settings.angle.y,  360, function (angle) {
        return "&beta;Y: " + angle + "&deg;";
    }, function (angle) {
        settings.angle.y = angle * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#rotate-z-slider"), settings.angle.z, 360, function (angle) {
        return "&gamma;Z: " + angle + "&deg;";
    }, function (angle) {
        settings.angle.z = angle * DEGREES_TO_RADIANS;
    });

    initializeListenerForSlider($("#translate-x-slider"), settings.translate.x,  CANVAS_WIDTH, function (translate) {
        return "&Delta;X:" + translate + "px";
    }, function (translate) {
        settings.translate.x = translate;
    });
    initializeListenerForSlider($("#translate-y-slider"), settings.translate.y, CANVAS_HEIGHT, function (translate) {
        return "&Delta;Y:" + translate + "px";
    }, function (translate) {
        settings.translate.y = translate;
    });
    initializeListenerForSlider($("#translate-z-slider"), settings.translate.z, 300, function (translate) {
        return "&Delta;Z:" + translate + "px";
    }, function (translate) {
        settings.translate.z = translate;
    });

    function initializeListenerForSlider(slider, initialValue, maxValue, messageCreator, valueProcessor) {
        var isDown = false;
        var parent = slider.parentNode;
        var size = slider.clientWidth
        var width = parent.clientWidth - size;
        var x, value, percent;
        slider.style.left = Math.round((initialValue / maxValue) * width) + "px";
        slider.innerHTML = messageCreator(initialValue);
        slider.addEventListener("mousedown", function () {
            isDown = true;
        });
        slider.addEventListener("mouseup", function () {
            isDown = false;
        });
        parent.addEventListener("mouseup", function () {
            isDown = false;
        });
        slider.addEventListener("mousemove", function (event) {
            if (isDown) {
                x = parseInt(slider.style.left.slice(0, -2) || 0);
                x += event.clientX - (parent.offsetLeft + x + size / 2);
                percent = x / width;
                value = Math.round(percent * maxValue);
                if (x < 0) {
                    x = 0;
                    value = 0;
                } else if (x > width) {
                    x = width;
                    value = maxValue;
                }
                slider.style.left = x + "px";
                slider.innerHTML = messageCreator(value);
                valueProcessor(value);
                transform(settings);
            }
        });
    };
};


