/**
 * Created by slesh on 10/23/15.
 */

"use strict";

var JagaEngine = Object.create(null);

JagaEngine.start = function(canvas, statusPanel){
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    var context = canvas.getContext("2d");
    context.font = "30px Arial";
    context.fillStyle = "white";

    var colors = Object.create(null);
    colors.outer = "blue";
    colors.inner = "red";
    colors.base = "green";

    var renders = [],
        parameters;

    parameters = JagaEngine.Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new JagaEngine.OrthogonalRender(context, JagaEngine.Util.createSettings(), parameters,
        new JagaEngine.Cone(parameters, new JagaEngine.Vector(150, 200, 500))));

    parameters = JagaEngine.Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new JagaEngine.AxonometricRender(context, JagaEngine.Util.createSettings(), parameters,
        [new JagaEngine.Cone(parameters, new JagaEngine.Vector(200, 200, 100)),
         new JagaEngine.Cone(parameters, new JagaEngine.Vector(400, 200, 100))]));

    parameters = this.Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new JagaEngine.ObliqueRender(context, this.Util.createSettings(), parameters,
        new JagaEngine.Cone(parameters, new JagaEngine.Vector(300, 200, 100))));

    parameters = JagaEngine.Util.createParameters(50, 100, 150, 8, colors);
    renders.push(new JagaEngine.PerspectiveRender(context, this.Util.createSettings(), parameters,
        new JagaEngine.Cone(parameters, new JagaEngine.Vector(0, 50, 350))));

    var controller = new JagaEngine.Controller(renders, statusPanel);
    controller.registerEvents();

    controller.render.rendering();
    controller.displayStatus();
};

window.onload = function() {
    JagaEngine.start(document.querySelector("canvas"), document.querySelector(".status"));
};