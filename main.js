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
        center: new Point(250, 450, 0)
    });

    conus.generatePoints({
        innerPoints: 5,
        outerPoints: 10
    });

    conus.draw(context);


    //for(var i = 0; i < 3; ++i){
    //    conus.rotate(new Point(50, 50), 30);
    //    context.clearRect(0, 0, canvas.width, canvas.height);
    //    conus.draw(context);
    //}

    $("#rotate-button").addEventListener("click", function () {
        conus.rotate(new Point(50, 50), 30);
        context.clearRect(0, 0, canvas.width, canvas.height);
        conus.draw(context);
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
            conus.rotate(new Point(50, 50), 30);
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


