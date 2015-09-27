"use strict";

/**
 * Created by slesh on 9/24/15.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var CANVAS_WIDTH = 900;
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
    var context = canvas.getContext("2d");

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
    transform(settings);

    function transform(settings) {
        if (settings.isUpdateGeometry) {
            cone.generateGeometry(parameters);
        }
        var rotateX, rotateY, rotateZ, scale, translateToOrigin, translateFromOrigin, transform;//matrices
        rotateX = Matrix.prototype.getRotateXMatrix(settings.angle.x);
        rotateY = Matrix.prototype.getRotateYMatrix(settings.angle.y);
        rotateZ = Matrix.prototype.getRotateZMatrix(settings.angle.z);
        scale = Matrix.prototype.getScaleMatrix(settings.scale);
        translateToOrigin = Matrix.prototype.getTranslateMatrix(settings.translate.clone().reverse());
        translateFromOrigin = Matrix.prototype.getTranslateMatrix(settings.translate);
        transform = Matrix.prototype.multiplyAll(translateFromOrigin, scale, rotateX, rotateY, rotateZ);
        cone.transform(translateToOrigin);
        cone.transform(transform);
        context.clearRect(0, 0, canvas.width, canvas.height);
        cone.draw(context);
    };

    initializeListenerForSlider($("#rotate-x-slider"), settings.angle.x, 0, 360, function (angle) {
        return "&ang;X: " + angle + "&deg;";
    }, function (angle) {
        settings.angle.x = angle * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#rotate-y-slider"), settings.angle.y, 0, 360, function (angle) {
        return "&ang;Y: " + angle + "&deg;";
    }, function (angle) {
        settings.angle.y = angle * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#rotate-z-slider"), settings.angle.z, 0, 360, function (angle) {
        return "&ang;Z: " + angle + "&deg;";
    }, function (angle) {
        settings.angle.z = angle * DEGREES_TO_RADIANS;
    });

    initializeListenerForSlider($("#translate-x-slider"), settings.translate.x, 0, CANVAS_WIDTH, function (translate) {
        return "&Delta;X:" + translate + "px";
    }, function (translate) {
        settings.translate.x = translate;
    });
    initializeListenerForSlider($("#translate-y-slider"), settings.translate.y, 0, CANVAS_HEIGHT, function (translate) {
        return "&Delta;Y:" + translate + "px";
    }, function (translate) {
        settings.translate.y = translate;
    });
    initializeListenerForSlider($("#translate-z-slider"), settings.translate.z, 0, 300, function (translate) {
        return "&Delta;Z:" + translate + "px";
    }, function (translate) {
        settings.translate.z = translate;
    });

    initializeListenerForSlider($("#scale-x-slider"), settings.scale.x, 0, 5, function (scale) {
        return "&times;" + scale + "X";
    }, function (scale) {
        settings.scale.x = scale;
    });
    initializeListenerForSlider($("#scale-y-slider"), settings.scale.y, 0, 5, function (scale) {
        return "&times;" + scale + "Y";
    }, function (scale) {
        settings.scale.y = scale;
    });
    initializeListenerForSlider($("#scale-z-slider"), settings.scale.z, 0, 5, function (scale) {
        return "&times;" + scale + "Z";
    }, function (scale) {
        settings.scale.z = scale;
    });

    initializeListenerForSlider($("#major-number-slider"), parameters.majorNumber, 3, 300, function (number) {
        return number;
    }, function (number) {
        settings.isUpdateGeometry = parameters.majorNumber != number;
        parameters.majorNumber = number;
    });
    initializeListenerForSlider($("#inner-radius-slider"), 2 * parameters.innerRadius, 10, 250, function (radius) {
        return "&Oslash; " + radius + "px";
    }, function (radius) {
        parameters.innerRadius = Math.round(radius / 2);
    });
    initializeListenerForSlider($("#outer-radius-slider"), 2 * parameters.outerRadius, 20, 500, function (radius) {
        return "&Oslash; " + radius + "px";
    }, function (radius) {
        parameters.outerRadius = Math.round(radius / 2);
    });

    function initializeListenerForSlider(slider, initialValue, minValue, maxValue, messageCreator, valueProcessor) {
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
                if (x < minValue) {
                    x = 0;
                    value = minValue;
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


