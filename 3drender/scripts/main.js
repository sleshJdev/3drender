/**
 * Created by slesh on 10/23/15.
 */

"use strict";

var Jaga = Object.create(null);

Jaga.d2r = Math.PI / 180;
Jaga.r2d = 180 / Math.PI;
Jaga.canvasWidth = 1000;
Jaga.canvasHeight = 600;

Jaga.create = function(canvas){
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    var context = canvas.getContext("2d");
    context.font = "30px Arial";
    context.fillStyle = "white";

    var colors = Object.create(null);
    colors.outer = "blue";
    colors.inner = "red";
    colors.base = "green";

    var renders = [],
        parameters;

    parameters = Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new OrthogonalRender(context, Util.createSettings(), parameters,
        new Cone(parameters, new Vector(150, 200, 500))));

    parameters = Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new AxonometricRender(context, Util.createSettings(), parameters,
        [new Cone(parameters, new Vector(200, 200, 100)), new Cone(parameters, new Vector(400, 200, 100))]));

    parameters = Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new ObliqueRender(context, Util.createSettings(), parameters,
        new Cone(parameters, new Vector(100, 200, 300))));

    parameters = Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new PerspectiveRender(context, Util.createSettings(), parameters,
        new Cone(parameters, new Vector(0, 50, 350))));

    var controller = new Controller(renders, document.querySelector(".status"));
    controller.registerEvents();

    controller.render.rendering();
    controller.displayStatus();
};

window.onload = function() {
    Jaga.create(document.querySelector("canvas"));
};