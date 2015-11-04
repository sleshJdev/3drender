/**
 * Created by slesh on 10/24/15.
 */

var RenderType = Object.create(null);
RenderType.ORTHOGONAL   = 0;
RenderType.AXONOMETRIC  = 1;
RenderType.OBLIQUE      = 2;
RenderType.PERSPECTIVE  = 3;

/*
render - base class for other renders
 */
function Render(type, context, model, settings, parameters) {
    this.type = type;
    this.context = context;
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;
}

Render.prototype.getStatus = function () {
    return "";
};

Render.prototype.resetSettings = function () {
    this.settings.translate.scale(0);
    this.settings.rotate.scale(0);
    this.settings.scale.restore();
};

Render.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, Jaga.canvasWidth, Jaga.canvasHeight);
};

Render.prototype.updateGeometry = function () {
    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        this.model.generateGeometry();
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
    model.totalTransformation = Matrix.prototype.getTranslateMatrix(model.origin);
}

/*
orthogonal projection
 */
OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, Matrix.prototype.getProjectionMatrix("xy"));
    this.model.project(this.context, Matrix.prototype.getProjectionMatrix("yz"));
    this.model.project(this.context, Matrix.prototype.getProjectionMatrix("xz"));

    this.context.fillText("XOY", this.model.origin.x + this.parameters.outerRadius, this.model.origin.y);
    this.context.fillText("ZOY", this.model.origin.z + this.parameters.outerRadius, this.model.origin.y);
    this.context.fillText("XOZ", this.model.origin.x + this.parameters.outerRadius, this.model.origin.z);
    this.resetSettings();
};

function AxonometricRender(context, models, settings, parameters) {
    Render.call(this, RenderType.AXONOMETRIC, context, null, settings, parameters);
    this.models = models;
    this.projections = [Matrix.prototype.getIsometricMatrix(), Matrix.prototype.getDimetricMatrix()];
    this.labels = ["Isometric", "Dimetric"];
    this.models.forEach(function (model) {
        model.totalTransformation = Matrix.prototype.getTranslateMatrix(model.origin);
    })
}

/*
axonometric(isometric and dimetric) projection
 */
AxonometricRender.prototype = Object.create(Render.prototype);

AxonometricRender.prototype.updateGeometry = function () {
    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        this.models.forEach(function (model) {
            model.generateGeometry();
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
        model.project(self.context, self.projections[index]);
        self.context.fillText(self.labels[index], model.origin.x - self.parameters.outerRadius, model.origin.y);
    });
    self.resetSettings();
};

/*
oblique projection
 */
function ObliqueRender(context, model, settings, parameters) {
    Render.call(this, RenderType.OBLIQUE, context, model, settings, parameters);
    model.totalTransformation = Matrix.prototype.getTranslateMatrix(model.origin);
}

ObliqueRender.prototype = Object.create(Render.prototype);

ObliqueRender.prototype.rendering = function () {
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, Matrix.prototype.getObliqueMatrix(1, 135 * Jaga.d2r));
    this.resetSettings();
};

/*
perspective projection
 */
function PerspectiveRender(context, model, settings, parameters){
    Render.call(this, RenderType.PERSPECTIVE,  context, model, settings, parameters);
    model.totalTransformation = Matrix.prototype.getTranslateMatrix(model.origin);
}

PerspectiveRender.prototype = Object.create(Render.prototype);

PerspectiveRender.prototype.rendering = function () {
    console.log(this.settings.perspective.c);
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, Matrix.prototype.getPerspectiveMatrix(this.settings.perspective.c));
    this.resetSettings();
};
