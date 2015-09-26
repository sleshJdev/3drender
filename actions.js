"use strict";

/**
 * Created by slesh on 9/24/15.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var CANVAS_WIDTH = 500;
    var CANVAS_HEIGHT = 1000;

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
    //context.width = CANVAS_WIDTH;
    //context.height = CANVAS_HEIGHT;

    var conus = new Conus({
        innerRadius: 100,
        outerRadius: 200,
        height: 250
    }, {
        center: new Vector(250, 400, 0)
    });

    conus.generatePoints({
        innerPoints: 10,
        outerPoints: 20
    });

    conus.draw(context);

    function transform(settings) {
        var translate = Matrix.prototype.getTranslateMatrix(-settings.trnslate.x, -settings.trnslate.y, -settings.trnslate.z);
        conus.transform(rotate);
        var rotateX = Matrix.prototype.getRotateXMatrix(settings.angle.x);
        var rotateY = Matrix.prototype.getRotateYMatrix(settings.angle.y);
        var rotateZ = Matrix.prototype.getRotateZMatrix(settings.angle.z);
        translate = Matrix.prototype.getTranslateMatrix(settings.trnslate.x, settings.trnslate.y, settings.trnslate.z);
        var transform = translate.multiplyOnMatrix(rotateY).multiplyOnMatrix(rotateZ);

        conus.transform(transform);


        context.clearRect(0, 0, canvas.width, canvas.height);
        conus.draw(context);
    };

    var settings = Object.create(null);
    settings.angle = Object.create(null);
    settings.angle.x = 0;
    settings.angle.y = 0;
    settings.angle.z = 0;
    settings.translate = Object.create(null);
    settings.translate.x = 0;
    settings.translate.y = 0;
    settings.translate.z = 0;
    settings.scale = Object.create(null);

    initializeListenerForSlider($("#rotate-x-slider"), 360, function (value) {
        return "&alpha;X: " + value + "&deg;";
    }, function (value) {
        settings.angle.x = value * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#rotate-y-slider"), 360, function (value) {
        return "&beta;Y: " + value + "&deg;";
    }, function (value) {
        settings.angle.y = value * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#rotate-z-slider"), 360, function (value) {
        return "&gamma;Z: " + value + "&deg;";
    }, function (value) {
        settings.angle.z = value * DEGREES_TO_RADIANS;
    });
    initializeListenerForSlider($("#translate-x-slider"), CANVAS_WIDTH, function (translate) {
        return "&Delta;" + translate;
    }, function (translate) {
        settings.translate.x = translate;
    });

    function initializeListenerForSlider(slider, maxValue, messageCreator, valueProcessor) {
        var isDown = false;
        var parent = slider.parentNode;
        var size = slider.clientWidth
        var width = parent.clientWidth - size;
        var x, value, percent;
        slider.addEventListener("mousedown", function () {
            isDown = true;
        });
        slider.addEventListener("mouseup", function () {
            isDown = false;
        });
        document.addEventListener("mouseup", function () {
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


