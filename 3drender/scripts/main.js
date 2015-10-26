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

    var renders = [],
        parameters;

    parameters = Util.createParameters(50, 100, 150, 8);
    renders.push(new OrthogonalRender(context, new Cone(parameters, new Vector(800, 200, 500)),
        Util.createSettings(), parameters));

    parameters = Util.createParameters(50, 100, 150, 8);
    renders.push(new AxonometricRender(context,
        [new Cone(parameters, new Vector(400, 350, 0)), new Cone(parameters, new Vector(850, 350, 0))],
        Util.createSettings(), parameters));

    parameters = Util.createParameters(50, 100, 150, 8);
    renders.push(new ObliqueRender(context, new Cone(parameters, new Vector(600, 250, 0)),
        Util.createSettings(), parameters));

    var controller = new Controller(renders, document.querySelector(".status"));
    controller.registerEvents();

    renders[0].rendering();
};

window.onload = function() {
    Jaga.create(document.querySelector("canvas"));
};