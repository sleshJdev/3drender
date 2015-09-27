"use strict"

/**
 * Created by slesh on 9/27/15.
 */


function Renderer(canvas, model, settings, parameters) {
    //canvas
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    //model
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;

    //matrices
    this.rotateX;
    this.rotateY;
    this.rotateZ;
    this.scale;
    this.translateToOrigin;
    this.translateFromOrigin;
    this.transform;
}

Renderer.prototype.rendering = function () {
    if (this.settings.isUpdateGeometry) {
        cone.generateGeometry(parameters);
    }
    this.rotateX = Matrix.prototype.getRotateXMatrix(this.settings.angle.x);
    this.rotateY = Matrix.prototype.getRotateYMatrix(this.settings.angle.y);
    this.rotateZ = Matrix.prototype.getRotateZMatrix(this.settings.angle.z);
    this.scale = Matrix.prototype.getScaleMatrix(this.settings.scale);
    this.translateToOrigin = Matrix.prototype.getTranslateMatrix(this.settings.translate.negative());
    this.translateFromOrigin = Matrix.prototype.getTranslateMatrix(this.settings.translate.positive());
    this.transform = Matrix.prototype.multiplyAll(this.translateFromOrigin, this.scale, this.rotateX, this.rotateY, this.rotateZ);
    this.model.transform(this.translateToOrigin);
    this.model.transform(this.transform);
    this.context.clearRect(0, 0, this.width, this.height);
    this.model.draw(this.context);
};

