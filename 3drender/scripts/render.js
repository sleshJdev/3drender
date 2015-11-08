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
    this.state = Util.createSettings();
}

Render.prototype.getStatus = function () {
    var t = this.state.translate;
    var r = this.state.rotate;
    var s = this.state.scale;

    return  "TRANSLATE</br>&Delta;X..................." + t.x +
                     "</br>&Delta;Y..................." + t.y +
                     "</br>&Delta;Z..................." + t.z + "</br></br>" +
                 "ROTATE</br>&ang;X..................." + r.x + "&deg;" +
                       "</br>&ang;Y..................." + r.y + "&deg;" +
                       "</br>&ang;Z..................." + r.z + "&deg;</br></br>" +
                       "SCALE</br>X...................." + s.x +
                            "</br>Y...................." + s.y +
                            "</br>Z...................." + s.z + "</br></br>" +
            "GEOMENTRY</br>Points..............." + this.parameters.majorNumber +
                     "</br>Height..............." + this.parameters.height +
                     "</br>Inner Radius........." + this.parameters.innerRadius +
                     "</br>Outer Radius........." + this.parameters.outerRadius + "</br></br>";
};

Render.prototype.updateState = function(){
    this.state.translate.shift(this.settings.translate);
    this.state.rotate.shift(this.settings.rotate);
    this.state.scale.multiply(this.settings.scale);

    this.state.scale.x = this.state.scale.x.toFixed(1);
    this.state.scale.y = this.state.scale.y.toFixed(1);
    this.state.scale.z = this.state.scale.z.toFixed(1);
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
    var r = Matrix.prototype.getRotateMatrix(this.settings.rotate.scale(Jaga.d2r));

    return t1.multiply(r).multiply(s).multiply(t2);
};


/*
 orthogonal projection
 */
function OrthogonalRender(context, model, settings, parameters) {
    Render.call(this, RenderType.ORTHOGONAL, context, model, settings, parameters);
    model.totalTransformation = Matrix.prototype.getTranslateMatrix(model.origin);
}

OrthogonalRender.prototype = Object.create(Render.prototype);

OrthogonalRender.prototype.rendering = function () {
    this.updateGeometry();
    this.updateState();
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
    self.updateState();
    self.updateGeometry();
    self.clearCanvas();
    var s = Matrix.prototype.getScaleMatrix(self.settings.scale);
    var r = Matrix.prototype.getRotateMatrix(self.settings.rotate.scale(Jaga.d2r));
    this.models.forEach(function (model, index) {
        var t1 = Matrix.prototype.getTranslateMatrix(model.origin.scale(-1));
        var t2 = Matrix.prototype.getTranslateMatrix(model.origin.scale(-1).shift(self.settings.translate));
        var m = t1.multiply(r).multiply(s).multiply(t2);
        model.transform(m).commit();
        model.project(self.context, self.projections[index]);
        self.context.fillText(self.labels[index], model.peak.x, model.peak.y);
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

ObliqueRender.prototype.getStatus = function () {
    var state = Render.prototype.getStatus.call(this);

    return state + "OBLIQUE</br>L....................."           + this.settings.oblique.l.toFixed(1) +
                          "</br>&ang;&alpha;...................." + this.settings.oblique.alpha + "&deg;</br></br>";
};

ObliqueRender.prototype.rendering = function () {
    this.updateState();
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, Matrix.prototype.getObliqueMatrix(this.settings.oblique.l, this.settings.oblique.alpha * Jaga.d2r));
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
    this.updateState();
    this.updateGeometry();
    this.clearCanvas();
    this.model.transform(this.buildTransformation()).commit();
    this.model.project(this.context, Matrix.prototype.getPerspectiveMatrix(this.settings.perspective.c));
    this.resetSettings();
};
