/**
 * Created by slesh on 10/23/15.
 */


var CONSTANTS = Object.create(null);

var Jaga = Object.create(null);

Jaga.ORTHG = 0;
Jaga.ISOMT = 1;

Jaga.d2r = Math.PI / 180;
Jaga.r2d = 180 / Math.PI;
Jaga.canvasWidth = 1300;
Jaga.canvasHeight = 600;

Jaga.create = function(canvas){
    canvas.width = Jaga.canvasWidth;
    canvas.height = Jaga.canvasHeight;
    var context = canvas.getContext("2d");

    var renders = [];

    var parameters = Util.createParameters(50, 100, 150, 8);
    var settings = Util.createSettings(new Vector(200, 300, 500));
    var model = new Cone(parameters);

    renders.push(new OrthogonalRender(context, model, settings, parameters));

    var controller = new Controller(renders);
    controller.registerEvents();
};

window.onload = function() {
    Jaga.create(document.querySelector("canvas"));
};