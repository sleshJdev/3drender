/**
 * Created by slesh on 10/24/15.
 */

"use strict";

(function (JagaEngine) {
    JagaEngine.RenderType = Object.create(null);
    JagaEngine.RenderType.ORTHOGONAL    = 0;
    JagaEngine.RenderType.AXONOMETRIC   = 1;
    JagaEngine.RenderType.OBLIQUE       = 2;
    JagaEngine.RenderType.PERSPECTIVE   = 3;
})(JagaEngine);


/*
 render - base class for other renders
 */
(function (JagaEngine) {
    JagaEngine.Render = (function () {
        function Render(type, drawContext, settings, parameters, model) {
            this.type = type;
            this.drawContext = drawContext;
            this.settings = settings;
            this.parameters = parameters;
            this.model = model;
            if (this.model.constructor == Array) {
                this.model.forEach(function (model) {
                    model.state = JagaEngine.Matrix.getTranslate(model.origin);
                })
            } else {
                this.model.state = JagaEngine.Matrix.getTranslate(this.model.origin);
            }
            this.state = JagaEngine.Util.createSettings();
            //useful constants
            this.d2r = Math.PI / 180;
            this.r2d = 180 / Math.PI;
        }

        Render.prototype.getProjector = (function () {
            var projector = Object.create(null);
            projector.getProjection = null;
            projector.do = function (vector) {
                vector.restore().transform(this.getProjection);
            };
            projector.prepare = function (projection) {
                projector.getProjection = projection;

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
            this.drawContext.clearRect(0, 0, JagaEngine.canvasWidth, JagaEngine.canvasHeight);
        };

        Render.prototype.updateGeometry = function () {
            this.state.translate.add(this.settings.translate);
            this.state.rotate.add(this.settings.rotate);
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
            var t1 = JagaEngine.Matrix.getTranslate(this.model.origin.scale(-1));
            var t2 = JagaEngine.Matrix.getTranslate(this.model.origin.scale(-1).add(this.settings.translate));
            var s = JagaEngine.Matrix.getScale(this.settings.scale);
            var r = JagaEngine.Matrix.getRotate(this.settings.rotate.scale(this.d2r));

            return t1.multiply(r).multiply(s).multiply(t2);
        };

        return Render;
    })();
})(JagaEngine);


/*
 orthogonal projection
 */
(function (JagaEngine) {
    JagaEngine.OrthogonalRender = (function () {
        function OrthogonalRender(drawContext, settings, parameters, model) {
            JagaEngine.Render.call(this, JagaEngine.RenderType.ORTHOGONAL, drawContext, settings, parameters, model);
        }

        OrthogonalRender.prototype = Object.create(JagaEngine.Render.prototype);

        OrthogonalRender.prototype.rendering = function () {
            this.updateGeometry();
            this.clearCanvas();
            this.model.transform(this.buildTransformation()).commit();
            this.model.project(this.drawContext, this.getProjector(JagaEngine.Matrix.getOrthogonal("xy")));
            this.model.project(this.drawContext, this.getProjector(JagaEngine.Matrix.getOrthogonal("yz")));
            this.model.project(this.drawContext, this.getProjector(JagaEngine.Matrix.getOrthogonal("xz")));
            this.drawContext.fillText("XOY", this.model.origin.x + this.parameters.outerRadius, this.model.origin.y);
            this.drawContext.fillText("ZOY", this.model.origin.z + this.parameters.outerRadius, this.model.origin.y);
            this.drawContext.fillText("XOZ", this.model.origin.x + this.parameters.outerRadius, this.model.origin.z);
            this.resetSettings();
        };

        return OrthogonalRender;
    })();
})(JagaEngine);


/*
 axonometric(isometric and dimetric) projection
 */
(function (JagaEngine) {
    JagaEngine.AxonometricRender = (function () {
        function AxonometricRender(drawContext, settings, parameters, models) {
            JagaEngine.Render.call(this, JagaEngine.RenderType.AXONOMETRIC, drawContext, settings, parameters, models);
            this.labels = ["Isometric", "Dimetric"];
            this.projections = [JagaEngine.Matrix.getIsometric(), JagaEngine.Matrix.getDimetrix()];

        }
        AxonometricRender.prototype = Object.create(JagaEngine.Render.prototype);

        AxonometricRender.prototype.rendering = function () {
            var self = this;
            self.updateGeometry();
            self.clearCanvas();
            var s = JagaEngine.Matrix.getScale(self.settings.scale);
            var r = JagaEngine.Matrix.getRotate(self.settings.rotate.scale(this.d2r));
            this.model.forEach(function (model, index) {
                var t1 = JagaEngine.Matrix.getTranslate(model.origin.scale(-1));
                var t2 = JagaEngine.Matrix.getTranslate(model.origin.scale(-1).add(self.settings.translate));
                var m = t1.multiply(r).multiply(s).multiply(t2);
                model.transform(m).commit();
                model.project(self.drawContext, self.getProjector(self.projections[index]));
                self.drawContext.fillText(self.labels[index], model.peak.x, model.peak.y);
            });
            self.resetSettings();
        };

        return AxonometricRender;
    })();
})(JagaEngine);


/*
 oblique projection
 */
(function (JagaEngine) {
    JagaEngine.ObliqueRender = (function () {
        function ObliqueRender(drawContext, settings, parameters, model) {
            JagaEngine.Render.call(this, JagaEngine.RenderType.OBLIQUE, drawContext, settings, parameters, model);
        }

        ObliqueRender.prototype = Object.create(JagaEngine.Render.prototype);

        ObliqueRender.prototype.getProjection = function (oblique) {
            var copy = Object.create(null);
            for(var property in oblique){
                copy[property] = oblique[property];
            }
            copy.alpha *= this.d2r;

            return JagaEngine.Matrix.getOblique(copy);
        };

        ObliqueRender.prototype.rendering = function () {
            this.updateGeometry();
            this.clearCanvas();
            this.model.transform(this.buildTransformation()).commit();
            this.model.project(this.drawContext, this.getProjector(this.getProjection(this.settings.oblique)));
            this.resetSettings();
        };

        return ObliqueRender;
    })();
})(JagaEngine);


/*
 perspective projection
 */
(function (JagaEngine) {
    JagaEngine.PerspectiveRender = (function () {
        function PerspectiveRender(drawContext, settings, parameters, model) {
            JagaEngine.Render.call(this, JagaEngine.RenderType.PERSPECTIVE, drawContext, settings, parameters, model);
        }

        PerspectiveRender.prototype = Object.create(JagaEngine.Render.prototype);

        PerspectiveRender.prototype.getProjector = (function () {
            var projector = Object.create(null);
            projector.projection = null;
            projector.viewWindow = null;
            projector.do = function (vector) {
                vector.restore().transform(this.projection).scale(1 / vector.w);
                vector.x = this.viewWindow.left + this.viewWindow.width * ( (1 + vector.x) / 2 );
                vector.y = this.viewWindow.top + this.viewWindow.height * ( (1 + vector.y) / 2 );
            };
            /*
             windowRectangle:{top,left,width,height}
             */
            projector.prepare = function (perspective) {
                projector.projection = PerspectiveRender.getProjection(perspective);
                projector.viewWindow = perspective.viewWindow;

                return projector;
            };

            return projector.prepare;
        })();

        PerspectiveRender.getProjection = function (perspective) {
            var copy = Object.create(null);
            for(var property in perspective){
                copy[property] = perspective[property];
            }
            copy.fov *= this.d2r;

            return JagaEngine.Matrix.perspective(copy);
        };

        PerspectiveRender.prototype.drawViewWindow = function (viewWindow) {
            this.drawContext.strokeStyle = "white";
            this.drawContext.beginPath();
            this.drawContext.moveTo(viewWindow.left, viewWindow.top);
            this.drawContext.lineTo(viewWindow.left + viewWindow.width, viewWindow.top);
            this.drawContext.lineTo(viewWindow.left + viewWindow.width, viewWindow.top + viewWindow.height);
            this.drawContext.lineTo(viewWindow.left, viewWindow.top + viewWindow.height);
            this.drawContext.closePath();
            this.drawContext.stroke();
        };

        PerspectiveRender.prototype.rendering = function () {
            var self = this;
            self.updateGeometry();
            self.clearCanvas();
            
            self.model.transform(this.buildTransformation()).commit();
            self.model.project(self.drawContext, self.getProjector(self.settings.perspective));
            self.drawViewWindow(self.settings.perspective.viewWindow);
            self.resetSettings();
        };

        return PerspectiveRender;
    })();
})(JagaEngine);
