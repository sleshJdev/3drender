/**
 * Created by slesh on 10/24/15.
 */

var RenderType = Object.create(null);
RenderType.ORTHOGONAL   = 0;
RenderType.AXONOMETRIC  = 1;
RenderType.OBLIQUE      = 2;

function Render(type, context, model, settings, parameters){
    this.type = type;
    this.context = context;
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;
}

Render.prototype.getStatus = function () {
    return "";
};

Render.prototype.resetSettings = function(){
    this.settings.translate.scale(0);
    this.settings.rotate.scale(0);
    this.settings.scale.restore();
};

Render.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, Jaga.canvasWidth, Jaga.canvasHeight);
}

Render.prototype.updateGeometry = function () {
    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        this.model.generateGeometry();
        this.model.transform(Matrix.prototype.getTranslateMatrix(this.model.origin)).commit();
    }
};

Render.prototype.buildTransformation = function () {
    var t1 = Matrix.prototype.getTranslateMatrix(this.model.origin.scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(this.model.origin.scale(-1).shift(this.settings.translate));
    var s = Matrix.prototype.getScaleMatrix(this.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);

    return t1.multiply(r).multiply(s).multiply(t2);
};

function OrthogonalRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ORTHOGONAL, context, model, settings, parameters);
}

OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    this.updateGeometry();

    this.clearCanvas();
    this.resetSettings();
    this.model.transform(this.buildTransformation()).commit();
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xy"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("yz"));
    this.model.draw(this.context, Matrix.prototype.getProjectionMatrix("xz"));

    this.context.font = "30px Arial";
    this.context.fillText("XOY", this.model.origin.x + this.parameters.outerRadius, this.model.origin.y);
    this.context.fillText("ZOY", this.model.origin.z + this.parameters.outerRadius, this.model.origin.y);
    this.context.fillText("XOZ", this.model.origin.x + this.parameters.outerRadius, this.model.origin.z);
};

function AxonometricRender(context, models, settings, parameters) {
    Render.call(this, RenderType.AXONOMETRIC, context, null, settings, parameters);
    this.models = models;
    this.projections = [Matrix.prototype.getIsometricMatrix(), Matrix.prototype.getDimetricMatrix()];
    this.labels = ["Isometric", "Dimetric"];
}

AxonometricRender.prototype = Object.create(Render.prototype);

AxonometricRender.prototype.updateGeometry = function () {
    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        this.models.forEach(function (model) {
            model.generateGeometry();
            model.transform(Matrix.prototype.getTranslateMatrix(model.origin)).commit();
        });
    }
};

AxonometricRender.prototype.rendering = function () {
    var self = this;
    self.clearCanvas();
    self.updateGeometry();
    var s = Matrix.prototype.getScaleMatrix(self.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(self.settings.rotate);
    this.models.forEach(function (model, index) {
        var t1 = Matrix.prototype.getTranslateMatrix(model.origin.scale(-1));
        var t2 = Matrix.prototype.getTranslateMatrix(model.origin.scale(-1).shift(self.settings.translate));
        var m = t1.multiply(r).multiply(s).multiply(t2);
        model.transform(m).commit();
        model.draw(self.context, self.projections[index]);
        self.context.fillText(self.labels[index], model.origin.x - self.parameters.outerRadius, model.origin.y);
    });
    self.resetSettings();
};

function ObliqueRender(context, model, settings, parameters) {
    Render.call(this, RenderType.OBLIQUE, context, model, settings, parameters);
};

ObliqueRender.prototype = Object.create(Render.prototype);

ObliqueRender.prototype.rendering = function () {
    this.updateGeometry();
    this.clearCanvas();
    this.resetSettings();
    this.model.transform(this.buildTransformation()).commit();
    this.model.draw(this.context, Matrix.prototype.getObliqueMatrix(0.5, 63.4 * Jaga.d2r));
};


