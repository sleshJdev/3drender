/**
 * Created by slesh on 9/24/15.
 */

var DEGREES_TO_RADIANS = Math.PI / 180;
var RADIANS_TO_DEGREES = 180 / Math.PI;

var log = console.log;
var cos = Math.cos;
var sin = Math.sin;

function $(selector) {
    return document.querySelector(selector);
}

window.onload = function () {
    var canvas = $("#jg-canvas");
    var context = canvas.getContext('2d');

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

    //conus.draw(context);

    var cube = new Cube();
    cube.draw(context);
    //
    //context.beginPath();
    //context.strokeStyle="blue";
    //context.moveTo(50, 50);
    //context.lineTo(200, 200);
    //context.stroke();

    $("#rotate-x-button").addEventListener("click", function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var angleX = parseInt($("#rotate-x-angle").value) * DEGREES_TO_RADIANS;
        var angleY = parseInt($("#rotate-y-angle").value) * DEGREES_TO_RADIANS;
        var angleZ = parseInt($("#rotate-z-angle").value) * DEGREES_TO_RADIANS;
        var cos, sin;

        cos = Math.cos(angleX);
        sin = Math.sin(angleX);
        var rotateX = new Matrix();
        rotateX.v11 = rotateX.v22 = cos;
        rotateX.v12 = -sin;
        rotateX.v21 = sin;

        cos = Math.cos(angleY);
        sin = Math.sin(angleY);
        var rotateY = new Matrix();
        rotateY.v00 = rotateY.v22 = cos;
        rotateY.v02 = sin;
        rotateY.v20 = -sin;

        cos = Math.cos(angleZ);
        sin = Math.sin(angleZ);
        var rotateZ = new Matrix();
        rotateZ.v00 = rotateZ.v11 = cos;
        rotateZ.v01 = -sin;
        rotateZ.v10 = sin;

        console.log("rotateX: " + rotateX);
        console.log("rotateY: " + rotateY);
        console.log("rotateZ: " + rotateZ);

        var rotate = rotateX.multiplyOnMatrix(rotateY).multiplyOnMatrix(rotateZ);
        console.log("rotate: " + rotate);

        var matrix = rotate;
        console.log("matrix " + matrix);

        cube.rotate(matrix);
        cube.draw(context);
    });

    var isDown = false;
    var slider = $("#rotate-slider");
    var parent = slider.parentNode;
    var maxWidth = parent.clientWidth;
    slider.addEventListener("mousedown", function () {
        isDown = true;
    });
    slider.addEventListener("mouseup", function () {
        isDown = false;
    });
    var left, offset, angle;
    slider.addEventListener("mousemove", function (event) {
        if (isDown) {
            left = parseInt(slider.style.left.slice(0, -2) || 0);
            offset = event.clientX - (parent.offsetLeft + left);
            angle = (left / (maxWidth + 25)) * 2 * Math.PI;
            context.clearRect(0, 0, canvas.width, canvas.height);
            conus.draw(context);
            slider.innerHTML = Math.round(RADIANS_TO_DEGREES * angle);
            left += offset - 25;
            if (left < 0) {
                left = 0;
            } else if (left > maxWidth - 50) {
                left = maxWidth - 50;
            }
            slider.style.left = left + "px";
        }
    });
};


