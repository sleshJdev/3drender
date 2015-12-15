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
            this.depthbuffer = new Array(this.workingWidth * this.workingHeight);
        }

        Device.prototype.clear = function () {
            this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
            for (var i = 0; i < this.depthbuffer.length; this.depthbuffer[i++] = 100000000);
        };
        Device.prototype.present = function () {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        };
        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;
            var index = ((x >> 0) + (y >> 0) * this.workingWidth);
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
        Device.prototype.project = function (coord, transMat) {
            var point = JagaEngine.Vector3.TransformCoordinates(coord, transMat);
            var x = this.workingWidth * (point.x + 0.5);
            var y = this.workingHeight * (point.y + 0.5);
            var z = 255 * (point.z + 0.5);
            return (new JagaEngine.Vector3(x, y, z));
        };
        Device.prototype.drawPoint = function (point, color) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
                this.putPixel(point.x, point.y, point.z, color);
            }
        };
        Device.prototype.clamp = function (value, min, max) {
            if (typeof min === "undefined") {
                min = 0;
            }
            if (typeof max === "undefined") {
                max = 1;
            }
            return Math.max(min, Math.min(value, max));
        };
        Device.prototype.interpolate = function (min, max, gradient) {
            return min + (max - min) * this.clamp(gradient);
        };
        Device.prototype.processScanLine = function (isfill, diffusion, y, pa, pb, pc, pd, a, b, c, d, color, background) {
            var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
            var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;
            var sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
            var ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;
            var z1 = this.interpolate(pa.z, pb.z, gradient1);
            var z2 = this.interpolate(pc.z, pd.z, gradient2);
            var n1 = this.interpolate(a, b, gradient1);
            var n2 = this.interpolate(c, d, gradient2);
            for (var x = sx; x < ex; x++) {
                var gradient = (x - sx) / (ex - sx);
                var z = this.interpolate(z1, z2, gradient);
                if (isfill) {
                    var n = diffusion + this.interpolate(n1, n2, gradient);
                    this.drawPoint(new JagaEngine.Vector3(x, y, z),
                        new JagaEngine.Color4(n * color.r, n * color.g, n * color.b, n * color.a));
                } else {
                    if (x === sx || x === ex - 1) {
                        this.drawPoint(new JagaEngine.Vector3(x, y, z), color);
                    } else {
                        this.drawPoint(new JagaEngine.Vector3(x, y, z), background);
                    }
                }
            }
        };
        Device.prototype.cross2D = function (x0, y0, x1, y1) {
            return x0 * y1 - x1 * y0;
        };
        Device.prototype.lineSide2D = function (p, lf/*line from*/, lt/*line to*/) {
            return this.cross2D(p.x - lf.x, p.y - lf.y, lt.x - lf.x, lt.y - lf.y);
        };
        Device.prototype.drawTriangle = function (isfill, diffusion, a, b, c, na, nb, bc, color, background) {
            if (a.y > b.y) { var temp = b; b = a; a = temp; }
            if (a.y > c.y) { var temp = a; a = c; c = temp; }
            if (b.y > c.y) { var temp = b; b = c; c = temp; }
            if (this.lineSide2D(b, a, c) > 0) {
                for (var y = a.y >> 0; y <= c.y >> 0; y++) {
                    if (y < b.y) {
                        this.processScanLine(isfill, diffusion, y, a, c, a, b, na, bc, na, nb, color, background);
                    } else {
                        this.processScanLine(isfill, diffusion, y, a, c, b, c, na, bc, nb, bc, color, background);
                    }
                }
            } else {
                for (var y = a.y >> 0; y <= c.y >> 0; y++) {
                    if (y < b.y) {
                        this.processScanLine(isfill, diffusion, y, a, b, a, c, na, nb, na, bc, color, background);
                    } else {
                        this.processScanLine(isfill, diffusion, y, b, c, a, c, nb, bc, na, bc, color, background);
                    }
                }
            }
            //var ab = b.y - a.y;
            //var bc = c.y - b.y;
            //var ac = c.y - a.y;
            //for(var y = a.y; y < c.y; ++y){
            //    var isFirstHalf = y < b.y;
            //    var alpha = ac === 0 ? 0 : (y - a.y) / ac;
            //    var beta  = isFirstHalf ? ab === 0 ? 0 : (y - a.y) / ab
            //                            : bc === 0 ? 0 : (y - b.y) / bc;
            //    var s = a.add(c.subtract(a).scale(alpha));
            //    var e = isFirstHalf ? a.add(b.subtract(a).scale(beta))
            //                        : c.add(c.subtract(b).scale(beta));
            //    for(var x = s.x; x < e.x; ++x){
            //        var phi = s.x === e.x ? 1 : (x - s.x) / (e.x - s.x);
            //        var point = s.add(e.subtract(s).scale(phi));
            //        this.drawPoint(new JagaEngine.Vector3(point.x, point.y, point.z), color);
            //    }
            //}
        };
        Device.prototype.computeNDotL = function (vertex, normal, lightPosition) {
            return Math.max(0, JagaEngine.Vector3.Dot(normal.normalize(), lightPosition.subtract(vertex).normalize()));
        };
        Device.prototype.bresenhamLine = (function () {
            var steep, temp, dx, dy, dx2, error, totalError, x, y, point = JagaEngine.Vector3.Zero();
            return function (a, b, color) {
                steep = false;
                if (Math.abs(a.x - b.x) < Math.abs(a.y - b.y)) {
                    temp = a.x; a.x = a.y; a.y = temp;
                    temp = b.x; b.x = b.y; b.y = temp;
                    steep = true;
                }
                if (a.x > b.x) {
                    temp = a; a = b; b = temp;
                }
                dy = b.y - a.y;
                dx = b.x - a.x;
                dx2 = 2 * dx;
                error = 2 * Math.abs(dy);
                totalError = 0;
                for (x = a.x, y = a.y; x <= b.x; ++x) {
                    totalError += error;
                    if (totalError > dx) {
                        totalError -= dx2;
                        y += a.y < b.y ? 1 : -1;
                    }
                    if (steep) {
                        point.x = y;
                        point.y = x;
                    }
                    else {
                        point.x = x;
                        point.y = y;
                    }
                    this.drawPoint(point, color);

                }
            }
        })();
        Device.prototype.render = function (cfg, mesh) {
            var self = this;
            var transformMatrix = JagaEngine.Matrix.RotationYawPitchRoll(-cfg.rotation.y * JagaEngine.D2R, -cfg.rotation.x * JagaEngine.D2R, cfg.rotation.z * JagaEngine.D2R);
            mesh.vertices.forEach(function (vertex) { vertex.rotateSelf(transformMatrix); });
            cfg.rotationTotal.x += cfg.rotation.x; cfg.rotation.x = 0;
            cfg.rotationTotal.y += cfg.rotation.y; cfg.rotation.y = 0;
            cfg.rotationTotal.z += cfg.rotation.z; cfg.rotation.z = 0;

            var worldMatrix = JagaEngine.Matrix.Translation(cfg.translation.x, -cfg.translation.y, cfg.translation.z);
            var worldViewTransformation = worldMatrix;
            switch (cfg.projection) {
                case JagaEngine.ORTOGONAL_XY:
                    transformMatrix = worldMatrix.multiply(JagaEngine.Matrix.Orthogonal("xy"));
                    break;
                case JagaEngine.ORTOGONAL_YZ:
                    transformMatrix = worldMatrix.multiply(JagaEngine.Matrix.Orthogonal("yz"));
                    break;
                case JagaEngine.ORTOGONAL_XZ:
                    transformMatrix = worldMatrix.multiply(JagaEngine.Matrix.Orthogonal("xz"));
                    break;
                case JagaEngine.AXONOMETRIC:
                    transformMatrix = worldMatrix.multiply(JagaEngine.Matrix.Axonometric(
                        cfg.axonometric.phi * JagaEngine.D2R,
                        cfg.axonometric.psi * JagaEngine.D2R));
                    worldViewTransformation = transformMatrix;
                    break;
                case JagaEngine.OBLIQUE:
                    transformMatrix = worldMatrix.multiply(JagaEngine.Matrix.Oblique(cfg.oblique.l, cfg.oblique.alpha * JagaEngine.D2R));
                    break;
                case JagaEngine.PERSPECTIVE:
                    var viewMatrix = JagaEngine.Matrix.LookAtLH(cfg.camera.position, cfg.camera.target, JagaEngine.Vector3.Up());
                    var perspectiveMatrix = JagaEngine.Matrix.PerspectiveFovLH(
                        cfg.perspective.fov * JagaEngine.D2R,
                        self.workingWidth / self.workingHeight,
                        cfg.perspective.znear,
                        cfg.perspective.zfar,
                        cfg.perspective.distance);
                    transformMatrix = worldMatrix.multiply(viewMatrix).multiply(perspectiveMatrix);
                    worldViewTransformation = worldMatrix.multiply(viewMatrix);
                    break;
            }
            var normals = [], normal, a, b, c;
            mesh.facets.forEach(function (facet) {
                a = self.project(facet.a, transformMatrix);
                b = self.project(facet.b, transformMatrix);
                c = self.project(facet.c, transformMatrix);
                if (cfg.isfill) {
                    normal = JagaEngine.Vector3.Cross(c.subtract(a), c.subtract(b));
                    //normals.push({start: pixelA, end: pixelA.add(normal)});
                    //normals.push({start: b, end: b.add(normal)});
                    //normals.push({start: pixelC, end: pixelC.add(normal)});
                    var na = self.computeNDotL(a, normal, cfg.light);
                    var nb = self.computeNDotL(b, normal, cfg.light);
                    var nc = self.computeNDotL(c, normal, cfg.light);
                    self.drawTriangle(cfg.isfill, cfg.diffusion,  a, b, c, na, nb, nc, facet.color);
                } else {
                    if (cfg.ishidelines) {
                        self.drawTriangle(cfg.isfill, cfg.diffusion, a, b, c, 1, 1, 1, facet.color, JagaEngine.Colors.BLACK);
                    } else {
                        self.bresenhamLine(a.clone(), b.clone(), facet.color);
                        self.bresenhamLine(b.clone(), c.clone(), facet.color);
                        self.bresenhamLine(c.clone(), a.clone(), facet.color);
                    }
                }
            });
            self.present();
            self.workingContext.beginPath();
            self.workingContext.arc(cfg.light.x, cfg.light.y, 20, 0, 2 * Math.PI, false);
            self.workingContext.fillStyle = "yellow";
            self.workingContext.fill();
            self.workingContext.lineWidth = 10;
            self.workingContext.strokeStyle = '#ff3300';
            self.workingContext.stroke();
            self.workingContext.lineWidth = 2;
            normals.forEach(function (normal) {
                var p1 = normal.start;
                var p2 = normal.end;
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