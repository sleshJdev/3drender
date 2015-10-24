"use strict"

/**
 * Created by slesh on 9/27/15.
 */
function OrthogonalRenderer(context, model, settings, parameters) {
    //canvas
    this.context = context;
    //model
    this.model = model;
    this.settings = settings;
    this.parameters = parameters;
    //matrices
    this.transform = null;
}

OrthogonalRenderer.prototype.rendering = function () {
    if (this.settings.isUpdateGeometry) {
        this.model.generateGeometry(this.parameters);
        this.settings.isUpdateGeometry = false;
    }
    var t1 =  Matrix.prototype.getScaleMatrix(this.model.origin.clone().scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(this.model.origin.shift(this.settings.translate));
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate);
    this.model.transform(t1);
    this.model.transform(r);
    this.model.transform(t2);
    this.model.draw(this.context);
};


