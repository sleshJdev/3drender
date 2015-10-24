/**
 * Created by slesh on 10/24/15.
 */

var RenderType = Object.create(null);
RenderType.ORTHOGONAL = 0;
RenderType.ISOMETRIC = 1;

function Render(type, context, model, settings, parameters){
    this.type = type;
    this.context = context;
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;
}

Render.prototype.clearCanvas = function(){
    this.context.clearRect(0, 0, Jaga.canvasWidth, Jaga.canvasHeight);
}

function OrthogonalRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ORTHOGONAL, context, model, settings, parameters);
}

OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    if (this.settings.isUpdateGeometry) {
        this.model.generateGeometry(this.parameters);
        this.settings.isUpdateGeometry = false;
        console.log("update geometry ... ok");
    }
    var t = Matrix.prototype.getTranslateMatrix(this.settings.translate);
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);

    this.model.transform(r.multiply(t));
    console.log("transform model ... ok");

    this.clearCanvas();
    this.model.draw(this.context);
    //console.log("draw model ... ok");
};

