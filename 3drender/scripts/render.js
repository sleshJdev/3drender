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
    this.settings = settings;
    this.parameters = parameters;
    this.state = Util.createSettings();
    this.model = model;
    if (this.model) {
        if (this.model.constructor == Array) {
            this.model.forEach(function (m) {
                m.state = Matrix.prototype.getTranslateMatrix(m.origin);
            })
        } else {
            this.model.state = Matrix.prototype.getTranslateMatrix(this.model.origin);

        }
    }

    this.getProjector = (function () {
        var self = this;
        self.projection = null;
        self.projector = function(vector) {
            vector.restore().transform(self.projection);
        };

        return function (projection) {
            self.projection = projection;

            return self.projector;
        }
    })();
}

Render.prototype.resetSettings = function () {
    this.settings.translate.scale(0);
    this.settings.rotate.scale(0);
    this.settings.scale.restore();
};

Render.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, Jaga.canvasWidth, Jaga.canvasHeight);
};

Render.prototype.updateGeometry = function () {
    this.state.translate.shift(this.settings.translate);
    this.state.rotate.shift(this.settings.rotate);
    this.state.scale.multiply(this.settings.scale);

    this.state.scale.x = this.state.scale.x.toFixed(1);
    this.state.scale.y = this.state.scale.y.toFixed(1);
    this.state.scale.z = this.state.scale.z.toFixed(1);

    if (this.settings.isUpdateGeometry) {
        this.settings.isUpdateGeometry = false;
        if (this.model && this.model.constructor == Array) {
            this.model.forEach(function (model) {
                model.generateGeometry();
            });
        } else {
            this.model.generateGeometry();
        }
    }
};

Render.prototype.buildTransformation = function () {
    var t1 = Matrix.prototype.getTranslateMatrix(this.model.origin.scale(-1));
    var t2 = Matrix.prototype.getTranslateMatrix(this.model.origin.scale(-1).shift(this.settings.translate));
    var s = Matrix.prototype.getScaleMatrix(this.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate.scale(Jaga.d2r));

    return t1.multiply(r).multiply(s).multiply(t2);
};


/*
 orthogonal projection
 */
function OrthogonalRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ORTHOGONAL, context, model, settings, parameters);
}

OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, this.getProjector(Matrix.prototype.getProjectionMatrix("xy")));
    this.model.project(this.context, this.getProjector(Matrix.prototype.getProjectionMatrix("yz")));
    this.model.project(this.context, this.getProjector(Matrix.prototype.getProjectionMatrix("xz")));

    this.context.fillText("XOY", this.model.origin.x + this.parameters.outerRadius, this.model.origin.y);
    this.context.fillText("ZOY", this.model.origin.z + this.parameters.outerRadius, this.model.origin.y);
    this.context.fillText("XOZ", this.model.origin.x + this.parameters.outerRadius, this.model.origin.z);
    this.resetSettings();
};


/*
 axonometric(isometric and dimetric) projection
 */
function AxonometricRender(context, models, settings, parameters) {
    Render.call(this, RenderType.AXONOMETRIC, context, models, settings, parameters);
    var self = this;
    self.labels     = ["Isometric", "Dimetric"];
    self.projectors = [function () { return self.getProjector(Matrix.prototype.getIsometricMatrix()) },
                       function () { return self.getProjector(Matrix.prototype.getDimetricMatrix()); }];
}

AxonometricRender.prototype = Object.create(Render.prototype);

AxonometricRender.prototype.rendering = function () {
    var self = this;
    self.updateGeometry();
    self.clearCanvas();
    var s = Matrix.prototype.getScaleMatrix(self.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(self.settings.rotate.scale(Jaga.d2r));
    this.model.forEach(function (model, index) {
        var t1 = Matrix.prototype.getTranslateMatrix(model.origin.scale(-1));
        var t2 = Matrix.prototype.getTranslateMatrix(model.origin.scale(-1).shift(self.settings.translate));
        var m = t1.multiply(r).multiply(s).multiply(t2);
        model.transform(m).commit();
        model.project(self.context, self.projectors[index]());
        self.context.fillText(self.labels[index], model.peak.x, model.peak.y);
    });
    self.resetSettings();
};


/*
 oblique projection
 */
function ObliqueRender(context, model, settings, parameters) {
    Render.call(this, RenderType.OBLIQUE, context, model, settings, parameters);
    model.state = Matrix.prototype.getTranslateMatrix(model.origin);
}

ObliqueRender.prototype = Object.create(Render.prototype);

ObliqueRender.prototype.rendering = function () {
    this.updateGeometry();
    this.clearCanvas();
    var projection = Matrix.prototype.getObliqueMatrix(this.settings.oblique.l, this.settings.oblique.alpha * Jaga.d2r);
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, this.getProjector(projection));
    this.resetSettings();
};


/*
 perspective projection
 */
function PerspectiveRender(context, model, settings, parameters){
    Render.call(this, RenderType.PERSPECTIVE,  context, model, settings, parameters);
}

PerspectiveRender.prototype = Object.create(Render.prototype);

PerspectiveRender.prototype.rendering = function () {
    var perspective = Object.create(null);
    perspective.fov = this.settings.perspective.fov * Jaga.d2r;
    perspective.aspect = this.settings.perspective.aspect;
    perspective.nearPlane = this.settings.perspective.nearPlane;
    perspective.farPlane = this.settings.perspective.farPlane;

    console.log("fov ",perspective.fov, " --- aspect ", perspective.aspect, " --- nearPlane ", perspective.nearPlane, " --- farPlane ", perspective.farPlane);
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, this.getProjector(Matrix.prototype.getPerspectiveMatrix(perspective)));

    console.log(this.model.vectors[0]);
    console.log(this.model.vectors[5]);
    console.log("\n\n");

    this.resetSettings();
};
