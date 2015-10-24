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

    var o = this.model.origin.restore().clone();
    var t1 = Matrix.prototype.getTranslateMatrix(o.scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(o.scale(-1).shift(this.settings.translate));
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);
    var m = t1.multiply(r).multiply(t2);

    this.clearCanvas();
    this.model.transform(m);
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xy"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("yz"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xz"));

    this.context.font = "30px Arial";
    this.context.fillText("XOY", o.x + this.parameters.outerRadius, o.y);
    this.context.fillText("ZOY", o.z + this.parameters.outerRadius, o.y);
    this.context.fillText("XOZ", o.x + this.parameters.outerRadius, o.z);

    this.settings.translate.scale(0);
    this.settings.rotate.scale(0);
};

