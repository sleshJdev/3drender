/**
 * Created by slesh on 10/24/15.
 */

var RenderType = Object.create(null);
RenderType.ORTHOGONAL = 0;
RenderType.AXONOMETRIC = 1;
RenderType.OBLIQUE = 2;
RenderType.PERSPECTIVE = 3;

/*
 render - base class for other renders
 */
function Render(type, context, settings, parameters, model) {
    this.type = type;
    this.context = context;
    this.settings = settings;
    this.parameters = parameters;
    this.model = model;
    if (this.model) {
        if (this.model.constructor == Array) {
            this.model.forEach(function (model) {
                model.state = Matrix.prototype.getTranslateMatrix(model.origin);
            })
        } else {
            this.model.state = Matrix.prototype.getTranslateMatrix(this.model.origin);

        }
    }
    this.state = Util.createSettings();
}

Render.prototype.getProjector = (function () {
    var projector = Object.create(null);
    projector.projection = null;
    projector.do = function (vector) {
        vector.restore().transform(this.projection);
    };
    projector.prepare = function (projection) {
        projector.projection = projection;

        return projector;
    };

    return projector.prepare;
})();

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
function OrthogonalRender(context, settings, parameters, model) {
    Render.call(this, RenderType.ORTHOGONAL, context, settings, parameters, model);
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
function AxonometricRender(context, settings, parameters, models) {
    Render.call(this, RenderType.AXONOMETRIC, context, settings, parameters, models);
    this.labels = ["Isometric", "Dimetric"];
    this.projections = [Matrix.prototype.getIsometricMatrix(), Matrix.prototype.getDimetricMatrix()];
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
        model.project(self.context, self.getProjector(self.projections[index]));
        self.context.fillText(self.labels[index], model.peak.x, model.peak.y);
    });
    self.resetSettings();
};


/*
 oblique projection
 */
function ObliqueRender(context, settings, parameters, model) {
    Render.call(this, RenderType.OBLIQUE, context, settings, parameters, model);
}

ObliqueRender.prototype = Object.create(Render.prototype);

ObliqueRender.prototype.rendering = function () {
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context,
        this.getProjector(Matrix.prototype.getObliqueMatrix(
            this.settings.oblique.l, this.settings.oblique.alpha * Jaga.d2r)));
    this.resetSettings();
};


/*
 perspective projection
 */
function PerspectiveRender(context, settings, parameters, model) {
    Render.call(this, RenderType.PERSPECTIVE, context, settings, parameters, model);
}

PerspectiveRender.prototype = Object.create(Render.prototype);

PerspectiveRender.prototype.getProjector = (function () {
    var projector = Object.create(null);
    projector.projection = null;
    projector.viewWindow = null;
    projector.do = function (vector) {
        vector.restore().transform(this.projection).scale(1 / vector.w);
        //vector.x = Jaga.canvasWidth * ( (1 + vector.x) / 2 );
        //vector.y = Jaga.canvasHeight * ( (1 + vector.y) / 2 );
        vector.x = this.viewWindow.left + this.viewWindow.width * ( (1 + vector.x) / 2 );
        vector.y = this.viewWindow.top + this.viewWindow.height * ( (1 + vector.y) / 2 );
    };
    /*
     windowRectangle:{top,left,width,height}
     */
    projector.prepare = function (projection, viewWindow) {
        projector.projection = projection;
        projector.viewWindow = viewWindow;

        return projector;
    };

    return projector.prepare;
})();

PerspectiveRender.prototype.drawViewWindow = function () {
    this.context.strokeStyle = "white";
    this.context.beginPath();
    var wv = this.settings.perspective.windowView;
    this.context.moveTo(wv.left, wv.top);
    this.context.lineTo(wv.left + wv.width, wv.top);
    this.context.lineTo(wv.left + wv.width, wv.top + wv.height);
    this.context.lineTo(wv.left, wv.top + wv.height);
    this.context.closePath();
    this.context.stroke();
};

PerspectiveRender.prototype.rendering = function () {
    var perspective = Object.create(null);
    for(var property in this.settings.perspective){
        perspective[property] = this.settings.perspective[property];
    }
    perspective.fov = this.settings.perspective.fov * Jaga.d2r;
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, this.getProjector(
            Matrix.prototype.getPerspectiveMatrix(perspective),
            this.settings.perspective.windowView));
    this.drawViewWindow();
    this.resetSettings();
};
