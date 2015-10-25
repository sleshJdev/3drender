/**
 * Created by slesh on 10/24/15.
 */

var RenderType = Object.create(null);
RenderType.ORTHOGONAL = 0;
RenderType.ISOMETRIC = 1;

function Render(type, context, settings, model, parameters){
    this.type = type;
    this.context = context;
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;
    this.origin = new Vector();
}

Render.prototype.clear = function(){
    this.context.clearRect(0, 0, Jaga.canvasWidth, Jaga.canvasHeight);
    this.settings.translate.scale(0);
    this.settings.rotate.scale(0);
    this.settings.scale.restore();
};

Render.prototype.updateGeometry = function () {
    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        this.model.generateGeometry();
        this.model.transform(Matrix.prototype.getTranslateMatrix(this.origin));
    }
};

function OrthogonalRender(context, settings, model) {
    Render.call(this, RenderType.ORTHOGONAL, context, settings, model, model.parameters);
}

OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    this.updateGeometry();

    var t1 = Matrix.prototype.getTranslateMatrix(this.origin.scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(this.origin.scale(-1).shift(this.settings.translate));
    var s = Matrix.prototype.getScaleMatrix(this.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);
    var m = t1.multiply(r).multiply(s).multiply(t2);

    this.clear();
    this.origin.restore().transform(m).commit();
    this.model.transform(m);
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xy"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("yz"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xz"));

    this.context.font = "30px Arial";
    this.context.fillText("XOY", this.origin.x + this.parameters.outerRadius, this.origin.y);
    this.context.fillText("ZOY", this.origin.z + this.parameters.outerRadius, this.origin.y);
    this.context.fillText("XOZ", this.origin.x + this.parameters.outerRadius, this.origin.z);
};

function AxonometricRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ISOMETRIC, context, model, settings, parameters);
}

AxonometricRender.prototype = Object.create(Render.prototype);

AxonometricRender.prototype.rendering = function () {
    this.updateGeometry();

    var t1 = Matrix.prototype.getTranslateMatrix(this.origin.scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(this.origin.scale(-1).shift(this.settings.translate));
    var s = Matrix.prototype.getScaleMatrix(this.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);
    var m = t1.multiply(r).multiply(s).multiply(t2);

    this.clear();
    this.origin.restore().transform(m).commit();
    this.model.transform(m);
    this.model.draw(this.context, Matrix.prototype.getIsometricMatrix());
    this.model.draw(this.context, Matrix.prototype.getDimetricMatrix());
};
