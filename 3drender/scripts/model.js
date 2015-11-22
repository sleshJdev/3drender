/**
 * Created by slesh on 10/24/15.
 */

"use strict";

/*
 model of cone
 */
(function (JagaEngine) {
    JagaEngine.Cone = (function () {
        function Cone(parameters, origin) {
            this.parameters = parameters;
            this.vertices = [];
            this.faces = [];
            this.origin = origin || new Vector();
            this.state = new JagaEngine.Matrix();// total transformation
            this.matrix = new JagaEngine.Matrix();// current transformation
        }

        Cone.prototype.generateGeometry = function () {
            var self  = this;
            this.peak = new JagaEngine.Vector(0, -this.parameters.height, 0);
            //generate vertices
            this.vertices = [];
            var current = new JagaEngine.Vector();
            var shift = (2 * Math.PI) / this.parameters.majorNumber;
            [this.parameters.innerRadius, this.parameters.outerRadius].forEach(function (radius) {
                for (var angle = 0, i = 0; i < self.parameters.majorNumber; angle += shift, ++i) {
                    current.x = radius * Math.cos(angle);
                    current.z = radius * Math.sin(angle);
                    self.vertices.push(current.clone());
                }
                self.vertices.push(self.vertices[self.vertices.length - self.parameters.majorNumber]);//closure: last = first
            });

            //generate faces
            this.faces = [];
            function buildFace(a, b, c, color) {
                var face = Object.create(null);
                face.a = a;
                face.b = b;
                face.c = c;
                face.color = color;

                return face;
            }
            var ipp = this.vertices[0],//previous inner vertex
                opp = this.vertices[this.parameters.majorNumber + 1],//previous outer vertex
                opc,//current outer vertex
                ipc;//current inner vertex
            for (var i = 1/*skip first*/; i <= this.parameters.majorNumber; ++i) {
                ipc = this.vertices[i];
                opc = this.vertices[i + this.parameters.majorNumber + 1];
                this.faces.push(buildFace(ipp, opp, opc, this.parameters.colors.base));
                this.faces.push(buildFace(ipp, opc, ipc, this.parameters.colors.base));
                this.faces.push(buildFace(ipp, ipc, this.peak, this.parameters.colors.inner));
                this.faces.push(buildFace(opp, opc, this.peak, this.parameters.colors.outer));
                ipp = ipc;
                opp = opc;
            }
            this.transform(this.state);
            this.state = new JagaEngine.Matrix();
            this.commit();
        };

        Cone.prototype.project = function (drawContext, projector) {
            this.faces.forEach(function (face) {
                projector.do(face.a);
                projector.do(face.b);
                projector.do(face.c);
                drawContext.beginPath();
                drawContext.strokeStyle = face.color.rgb;
                drawContext.moveTo(face.a.x, face.a.y);
                drawContext.lineTo(face.b.x, face.b.y);
                drawContext.lineTo(face.c.x, face.c.y);
                drawContext.moveTo(face.a.x, face.a.y);
                drawContext.stroke();
            });

            return this;
        };

        Cone.prototype.transform = function (matrix) {
            this.matrix = matrix;
            this.peak.restore().transform(matrix);
            this.vertices.forEach(function (vector) {
                vector.restore().transform(matrix);
            });

            return this;
        };

        Cone.prototype.commit = function () {
            this.state = this.state.multiply(this.matrix);
            this.peak.commit();
            this.vertices.forEach(function (vector) {
                vector.commit();
            });

            return this;
        };

        return Cone;
    })();
})(JagaEngine || (JagaEngine = Object.create(null)));