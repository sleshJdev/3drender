"use strict"

/**
 * Created by slesh on 9/27/15.
 */


function Renderer(context, model, projection, settings, parameters){
    //canvas
    this.context = context;
    //model
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;

    //matrices
    this.projection = projection;
    this.transform;
    this.rotate;
    this.scale;
    this.translate;
}

Renderer.prototype.checkGeometryUpdate = function () {
    if (this.settings.isUpdateGeometry) {
        this.model.generateGeometry(this.parameters);
        this.settings.isUpdateGeometry = false;
    }
};

Renderer.prototype.buildTransform = function () {
    this.scale = Matrix.prototype.getScaleMatrix(this.settings.scale);
    this.rotate = Matrix.prototype.getRotateMatrix(this.settings.rotate);
    this.translate = Matrix.prototype.getTranslateMatrix(this.settings.translate.positive());
    this.transform = this.translate.multiply(this.scale).multiply(this.rotate);
};

Renderer.prototype.transformAndDrawModel = function(transform, projection){
    this.model.transform(transform, projection);
    this.model.draw(this.context);
};

function OrthogonalRenderer(context, model, settings, parameters) {
    Renderer.call(this, context, model, Matrix.prototype.getProjectionMatrix("xy"), settings, parameters);
}

OrthogonalRenderer.prototype = Object.create(Renderer.prototype);

OrthogonalRenderer.prototype.rendering = function () {
    this.checkGeometryUpdate();
    this.buildTransform();
    this.transformAndDrawModel(this.transform, Matrix.prototype.getProjectionMatrix("xy"));
    this.transformAndDrawModel(this.transform, Matrix.prototype.getProjectionMatrix("yz"));
    this.transformAndDrawModel(this.transform, Matrix.prototype.getProjectionMatrix("xz"));
};

function IsometricRenderer(context, model, settings, parameters){
    Renderer.call(this, context, model, Matrix.prototype.getProjectionMatrix("xy"), settings, parameters);
    this.alpha;
    this.betta;
}

IsometricRenderer.prototype = Object.create(Renderer.prototype);

IsometricRenderer.prototype.rendering = function () {
    this.checkGeometryUpdate();
    var DEGREES_TO_RADIANS = Math.PI / 180;
    var RADIANS_TO_DEGREES = 180 / Math.PI;
    var alpha = -35 * DEGREES_TO_RADIANS;
    var betta = 45 * DEGREES_TO_RADIANS;
    this.settings.rotate.x = alpha;
    this.settings.rotate.y = betta;
    //this.rotate = Matrix.prototype.getRotateXMatrix(this.alpha).multiply(Matrix.prototype.getRotateYMatrix(this.betta));
    this.buildTransform();
    this.transformAndDrawModel(this.transform, this.projection);
};

