/**
 * Created by slesh on 10/23/15.
 */

"use strict";

var Jaga = Object.create(null);

Jaga.d2r = Math.PI / 180;
Jaga.r2d = 180 / Math.PI;
Jaga.canvasWidth = 1300;
Jaga.canvasHeight = 600;

Jaga.create = function(canvas){
    canvas.width = Jaga.canvasWidth;
    canvas.height = Jaga.canvasHeight;
    var context = canvas.getContext("2d");

    var renders = [];
    renders.push(new OrthogonalRender(context,
        Util.createSettings(new Vector(800, 200, 500)),
        new Cone(Util.createParameters(50, 100, 150, 8))));
    renders.push(new AxonometricRender(context,
        Util.createSettings(new Vector(500, 50, 500)),
        new Cone(Util.createParameters(50, 100, 150, 8))));

    var controller = new Controller(renders);
    controller.registerEvents();

    renders[0].rendering();
};

window.onload = function() {
    Jaga.create(document.querySelector("canvas"));
};