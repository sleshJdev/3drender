"use strict"

/**
 * Created by slesh on 9/27/15.
 */


function Renderer(context, model, projection, settings, parameters) {
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
    this.transform = this.rotate.multiply(this.scale).multiply(this.translate);
};

Renderer.prototype.transformAndDrawModel = function (transform, projection) {
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
    //var p = this.settings.translate;
    //this.model.transform(Matrix.prototype.getTranslateMatrix(new Vector(-p.x,-p.y, -p.z)), this.projection);
    //this.model.transform(this.scale, this.projection);
    //this.model.transform(this.rotate, this.projection);
    //this.model.transform(Matrix.prototype.getTranslateMatrix(this.settings.translate.positive()), this.projection);
    //this.model.draw(this.context);
    this.transformAndDrawModel(this.transform, Matrix.prototype.getProjectionMatrix("xy"));
    this.transformAndDrawModel(this.transform, Matrix.prototype.getProjectionMatrix("yz"));
    this.transformAndDrawModel(this.transform, Matrix.prototype.getProjectionMatrix("xz"));
};

function IsometricRenderer(context, model, settings, parameters) {
    Renderer.call(this, context, model, Matrix.prototype.getProjectionMatrix("xy"), settings, parameters);
    this.phi = 30;//angle for x axes
    this.psi = 30;//angle for y axes
}

IsometricRenderer.prototype = Object.create(Renderer.prototype);

IsometricRenderer.prototype.rendering = function () {
    this.checkGeometryUpdate();
    var mx = Matrix.prototype.getRotateXMatrix(this.phi);
    var my = Matrix.prototype.getRotateYMatrix(this.psi);
    this.translate = Matrix.prototype.getTranslateMatrix(this.settings.translate.positive());
    var rm = this.translate.multiply(mx).multiply(my);
    this.model.transform(Matrix.prototype.getTranslateMatrix(this.settings.translate.negative()));
    this.transformAndDrawModel(rm, this.projection);
};

