/**
 * Created by slesh on 12/8/15.
 */
"use strict";

(function (JagaEngine) {
    var Device = (function () {
        function Device(canvas) {
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext("2d");
            this.depthbufferOrigin = new Array(this.workingWidth * this.workingHeight);
            this.depthbufferOrigin.fill(10000, NaN, NaN);
            this.depthbuffer = this.depthbufferOrigin.slice();
        }

        Device.prototype.clear = function () {
            this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
            this.depthbuffer = this.depthbufferOrigin.slice();
        };
        Device.prototype.present = function () {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        };
        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;
            var index = ((x >> 0) + (y >> 0) * this.workingWidth);
            var index4 = index * 4;
            if (this.depthbuffer[index] < z) { return; }
            this.depthbuffer[index] = z;
            this.backbufferdata[index4] = color.r * 255;
            this.backbufferdata[index4 + 1] = color.g * 255;
            this.backbufferdata[index4 + 2] = color.b * 255;
            this.backbufferdata[index4 + 3] = color.a * 255;
        };
        Device.prototype.project = function (coord, transMat) {
            var point = BABYLON.Vector3.TransformCoordinates(coord, transMat);
            var x = point.x * this.workingWidth + this.workingWidth / 2.0;
            var y = point.y * this.workingHeight + this.workingHeight / 2.0;
            return (new BABYLON.Vector3(x, y, point.z));
        };
        Device.prototype.drawPoint = function (point, color) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
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
            for (var x = sx; x < ex; x++) {
                var gradient = (x - sx) / (ex - sx);
                var z = this.interpolate(z1, z2, gradient);
                this.drawPoint(new BABYLON.Vector3(x, y, z), color);
            }
        };
        Device.prototype.cross2D = function (x0, y0, x1, y1) {
            return x0 * y1 - x1 * y0;
        };
        Device.prototype.lineSide2D = function (p, lf/*line from*/, lt/*line to*/) {
            return this.cross2D(p.x - lf.x, p.y - lf.y, lt.x - lf.x, lt.y - lf.y);
        };
        Device.prototype.drawTriangle = function (p1, p2, p3, color) {
            if (p1.y > p2.y) { var temp = p2; p2 = p1; p1 = temp; }
            if (p2.y > p3.y) { var temp = p2; p2 = p3; p3 = temp; }
            if (p1.y > p2.y) { var temp = p2; p2 = p1; p1 = temp; }
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
        Device.prototype.computeNDotL = function (vertex, normal, lightPosition) {
            var lightDirection = lightPosition.subtract(vertex);

            return Math.max(0, BABYLON.Vector3.Dot(normal.normalize(), lightDirection.normalize()));
        };
        Device.prototype.render = function (cfg, mesh) {
            var self = this,
                normals = [], normal, center, end, color, ndotl, light = cfg.light.clone(),
                pixelA, pixelB, pixelC, pixelWorldA, pixelWorldB, pixelWorldC, normalA, normalB, normalC,
                viewMatrix, projectionMatrix, worldMatrix, worldViewTransformation, transformMatrix;
            viewMatrix = BABYLON.Matrix.LookAtLH(cfg.camera.position, cfg.camera.target, BABYLON.Vector3.Up());
            projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(
                cfg.perspective.fov / 180,
                cfg.perspective.aspect,
                cfg.perspective.znear,
                cfg.perspective.zfar,
                cfg.perspective.distance);
            worldMatrix = BABYLON.Matrix.RotationYawPitchRoll(
                cfg.rotation.y / 180,
                cfg.rotation.x / 180,
                cfg.rotation.z / 180).multiply(BABYLON.Matrix.Translation(
                    cfg.translation.x,
                    cfg.translation.y,
                    cfg.translation.z));
            worldViewTransformation = worldMatrix.multiply(viewMatrix);
            transformMatrix = worldViewTransformation.multiply(projectionMatrix);
            mesh.facets.forEach(function (facet) {
                pixelA = self.project(facet.a, transformMatrix);
                pixelB = self.project(facet.b, transformMatrix);
                pixelC = self.project(facet.c, transformMatrix);
                pixelWorldA = BABYLON.Vector3.TransformCoordinates(facet.a, worldViewTransformation);
                pixelWorldB = BABYLON.Vector3.TransformCoordinates(facet.b, worldViewTransformation);
                pixelWorldC = BABYLON.Vector3.TransformCoordinates(facet.c, worldViewTransformation);
                normalA = BABYLON.Vector3.Cross(pixelWorldA, pixelWorldB);
                normalB = BABYLON.Vector3.Cross(pixelWorldB, pixelWorldC);
                normalC = BABYLON.Vector3.Cross(pixelWorldC, pixelWorldA);
                center = pixelA.add(pixelB).add(pixelC).scale(1 / 3);
                normal = normalA.add(normalB).add(normalC).scale(1 / 3);
                end = center.add(normal.scale(20000));
                normals.push({start: center, end: end});
                ndotl = self.computeNDotL(center, normal, light);
                color = new BABYLON.Color4(ndotl * facet.color.r, ndotl * facet.color.g, ndotl * facet.color.b, ndotl * facet.color.a);
                self.drawTriangle(pixelA, pixelB, pixelC, color);
            });
            self.present();
            self.workingContext.fillStyle = "yellow";
            self.workingContext.fillRect(light.x - 10, light.y - 10, 20, 20);
            self.workingContext.strokeStyle = "#ffffff";
            normals.forEach(function (p) {
                var p1 = p.start;
                var p2 = p.end;
                self.workingContext.beginPath();
                self.workingContext.moveTo(p1.x, p1.y);
                self.workingContext.lineTo(p2.x, p2.y);
                self.workingContext.stroke();
                self.workingContext.fillStyle = "#ffffff";
                self.workingContext.fillRect(p1.x - 2, p1.y - 2, 5, 5);
                self.workingContext.fillStyle = "#ff00ff";
                self.workingContext.fillRect(p2.x - 2, p2.y - 2, 5, 5);
            });
        };
        return Device;
    })();
    JagaEngine.Device = Device;
})(JagaEngine || (JagaEngine = Object.create(null)));