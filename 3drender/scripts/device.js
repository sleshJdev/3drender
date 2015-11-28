/**
 * Created by slesh on 11/14/15.
 */
"use strict";

(function (JagaEngine) {
    JagaEngine.Device = (function () {
        function Device(drawContext) {
            this.drawContext = drawContext;
            this.depthbuffer = new Array(JagaEngine.canvasWidth * JagaEngine.canvasHeight);
            this.backbuffer = this.drawContext.getImageData(0, 0, JagaEngine.canvasWidth, JagaEngine.canvasHeight);
        }

        Device.prototype.clear = function () {
            this.drawContext.clearRect(0, 0, JagaEngine.canvasWidth, JagaEngine.canvasHeight);
            this.backbuffer = this.drawContext.getImageData(0, 0, JagaEngine.canvasWidth, JagaEngine.canvasHeight);
            for (var i = 0; i < this.depthbuffer.length; i++) {
                this.depthbuffer[i] = 10000000;
            }
        };

        Device.prototype.processScanLine = function (y, pa, pb, pc, pd, color) {
            var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
            var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;
            var sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
            var ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;
            var z1 = this.interpolate(pa.z, pb.z, gradient1);
            var z2 = this.interpolate(pc.z, pd.z, gradient2);
            for (var x = sx; x < ex; x++) {
                var gradient = (x - sx) / (ex - sx);
                var z = this.interpolate(z1, z2, gradient);
                this.drawPoint(new JagaEngine.Vector(x, y, z), color);
            }
        };

        Device.prototype.drawTriangle = function (p1, p2, p3, color) {
            if (p1.y > p2.y) { var temp = p2; p2 = p1; p1 = temp; }
            if (p2.y > p3.y) { var temp = p2; p2 = p3; p3 = temp; }
            if (p1.y > p2.y) { var temp = p2; p2 = p1; p1 = temp; }
            var dp1p2 = 0,
                dp1p3 = 0;
            if (p2.y - p1.y > 0) { dp1p2 = (p2.x - p1.x) / (p2.y - p1.y); }
            if (p3.y - p1.y > 0) { dp1p3 = (p3.x - p1.x) / (p3.y - p1.y); }
            if (dp1p2 > dp1p3) {
                for (var y = p1.y >> 0; y <= p3.y >> 0; y++) {
                    if (y < p2.y) {
                        this.processScanLine(y, p1, p3, p1, p2, color);
                    } else {
                        this.processScanLine(y, p1, p3, p2, p3, color);
                    }
                }
            } else {
                for (var y = p1.y >> 0; y <= p3.y >> 0; y++) {
                    if (y < p2.y) {
                        this.processScanLine(y, p1, p2, p1, p3, color);
                    } else {
                        this.processScanLine(y, p2, p3, p1, p3, color);
                    }
                }
            }
        };

        Device.prototype.drawPoint = function (point, color) {
            if (point.x >= 0 && point.y >= 0 && point.x < JagaEngine.canvasWidth && point.y < JagaEngine.canvasHeight) {
                this.putPixel(point.x, point.y, point.z, color);
            }
        };

        Device.prototype.clamp = function (value, min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 1; }

            return Math.max(min, Math.min(value, max));
        };

        Device.prototype.interpolate = function (min, max, gradient) {
            return min + (max - min) * this.clamp(gradient);
        };

        Device.prototype.present = function () {
            this.drawContext.putImageData(this.backbuffer, 0, 0);
        };

        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;
            var index = ((x >> 0) + (y >> 0) * JagaEngine.canvasWidth);
            var index4 = index * 4;
            if (this.depthbuffer[index] < z) {
                return;
            }
            this.depthbuffer[index] = z;
            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        };

        Device.prototype.project = function (vector, transformation) {
            var point = JagaEngine.Vector.TransformCoordinates(vector, transformation);
            var x =  point.x * JagaEngine.canvasWidth + JagaEngine.canvasWidth / 2.0;
            var y =  point.y * JagaEngine.canvasHeight + JagaEngine.canvasHeight / 2.0;

            return (new JagaEngine.Vector(x, y, point.z));
        };

        Device.prototype.planeRender = function (model, transformation) {
            var self = this;
            model.faces.forEach(function (face) {
                var pixelA = self.project(face.a, transformation);
                var pixelB = self.project(face.b, transformation);
                var pixelC = self.project(face.c, transformation);
                self.drawTriangle(pixelA, pixelB, pixelC, face.color);
            });
        };

        Device.prototype.render = function (camera, model, perspecrive) {
            var self = this;
            var viewMatrix = JagaEngine.Matrix.LookAtLH(camera.position, camera.target, JagaEngine.Vector.Up());
            var projectionMatrix = JagaEngine.Matrix.PerspectiveFovLH(perspecrive.fov, perspecrive.aspect, perspecrive.nearPlane, perspecrive.farPlane);
            var transformMatrix = viewMatrix.multiply(projectionMatrix);
            model.faces.forEach(function (face) {
                var pixelA = self.project(face.a, transformMatrix);
                var pixelB = self.project(face.b, transformMatrix);
                var pixelC = self.project(face.c, transformMatrix);
                self.drawTriangle(pixelA, pixelB, pixelC, face.color);
            });
        };

        return Device;
    })();

})(JagaEngine);


