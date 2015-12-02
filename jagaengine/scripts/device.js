/**
 * Created by slesh on 11/30/15.
 */

"use strict";

(function (JagaEngine) {
    var Device = (function () {
        function Device(canvas) {
            this.d2r = Math.PI / 180;
            this.r2d = 180 / Math.PI;
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.width = canvas.width;
            this.height = canvas.height;
            this.depthbuffer = new Array(this.width * this.height);
        }
        Device.prototype.cross2D = function (x0, y0, x1, y1) {
            return x0 * y1 - x1 * y0;
        };
        Device.prototype.lineSide2D = function (p, lf/*line from*/, lt/*line to*/) {
            return this.cross2D(p.x - lf.x, p.y - lf.y, lt.x - lf.x, lt.y - lf.y);
        };
        Device.prototype.clear = function () {
            this.context.clearRect(0, 0, this.width, this.height);
            this.backbuffer = this.context.getImageData(0, 0, this.width, this.height);
            for(var i = 0; i < this.depthbuffer.length; i++) {
                this.depthbuffer[i] = 10000000;
            }
        };
        Device.prototype.present = function () {
            this.context.putImageData(this.backbuffer, 0, 0);
        };
        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;
            var index = ((x >> 0) + (y >> 0) * this.width);
            var index4 = index * 4;
            if(this.depthbuffer[index] < z) {
                return;
            }
            this.depthbuffer[index] = z;
            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        };
        Device.prototype.project = function (vector, transformation) {
            var point = Babylon.Vector3.TransformCoordinates(vector, transformation);
            var x = point.x * this.height + this.width / 2.0;
            var y = point.y * this.height + this.width / 2.0;

            return new Babylon.Vector3(x, y, point.z);
        };
        Device.prototype.drawPoint = function (point, color) {
            if(point.x >= 0 && point.y >= 0 && point.x < this.width && point.y < this.height) {
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
        Device.prototype.processScanLine = function (y, pa, pb, pc, pd, color) {
            var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
            var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;
            var sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
            var ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;
            var z1 = this.interpolate(pa.z, pb.z, gradient1);
            var z2 = this.interpolate(pc.z, pd.z, gradient2);
            for(var x = sx; x < ex; x++) {
                var gradient = (x - sx) / (ex - sx);
                var z = this.interpolate(z1, z2, gradient);
                this.drawPoint(new Babylon.Vector3(x, y, z), color);
            }
        };
        Device.prototype.drawTriangle = function (p1, p2, p3, color) {
            if(p1.y > p2.y) { var temp = p2; p2 = p1; p1 = temp; }
            if(p2.y > p3.y) { var temp = p2; p2 = p3; p3 = temp; }
            if(p1.y > p2.y) { var temp = p2; p2 = p1; p1 = temp; }
            if (this.lineSide2D(p2, p1, p3) > 0) {
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



        Device.prototype.renderMesh = function (model, transformation) {
            var world = model.getWorldTransformation();
            var transformation = world.multiply(transformation);
            var self = this;
            var a, b, c;
            model.faces.forEach(function (face) {
                a = self.project(face.a, transformation);
                b = self.project(face.b, transformation);
                c = self.project(face.c, transformation);
                self.context.beginPath();
                self.context.strokeStyle = face.color.rgba;
                self.context.moveTo(a.x, a.y);
                self.context.lineTo(b.x, b.y);
                self.context.lineTo(c.x, c.y);
                self.context.closePath();
                self.context.stroke();
            });
        };

        Device.prototype.render = function (model, camera, perspective) {
            var world = model.getWorldTransformation();
            var view = Babylon.Matrix.LookAtLH(camera.position, camera.target, Babylon.Vector3.Up());
            var projection = Babylon.Matrix.PerspectiveFovLH(this.d2r * perspective.fov, perspective.aspect, 1.0, 1000.0);
            var transformation = world.multiply(view).multiply(projection);
            var self = this;
            model.faces.forEach(function (face) {
                var a = self.project(face.a, transformation);
                var b = self.project(face.b, transformation);
                var c = self.project(face.c, transformation);
                self.drawTriangle(a, b, c, face.color);
            });
        };

        return Device;
    })();
    JagaEngine.Device = Device;
})(JagaEngine || (JagaEngine = Object.create(null)));