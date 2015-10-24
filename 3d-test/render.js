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
    this.origin = new Vector();
}

Render.prototype.clearCanvas = function(){
    this.context.clearRect(0, 0, Jaga.canvasWidth, Jaga.canvasHeight);
};

function OrthogonalRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ORTHOGONAL, context, model, settings, parameters);
}

OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        console.log("this.settings.translate: " + this.settings.translate);
        this.model.generateGeometry(this.parameters);
        this.model.transform(Matrix.prototype.getTranslateMatrix(this.origin));
    }

    var t1 = Matrix.prototype.getTranslateMatrix(this.origin.scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(this.origin.scale(-1).shift(this.settings.translate));
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);
    var m = t1.multiply(r).multiply(t2);

    this.origin.restore().transform(m).commit();
    this.clearCanvas();
    this.model.transform(m);
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xy"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("yz"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xz"));

    this.context.font = "30px Arial";
    this.context.fillText("XOY", this.origin.x + this.parameters.outerRadius, this.origin.y);
    this.context.fillText("ZOY", this.origin.z + this.parameters.outerRadius, this.origin.y);
    this.context.fillText("XOZ", this.origin.x + this.parameters.outerRadius, this.origin.z);

    this.settings.translate.scale(0);
    this.settings.rotate.scale(0);
};


function IsometricRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ISOMETRIC, context, model, settings, parameters);
}

IsometricRender.prototype = Object.create(Render.prototype);

IsometricRender.prototype.rendering = function () {

};
