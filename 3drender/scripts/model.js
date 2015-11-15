/**
 * Created by slesh on 10/24/15.
 */

"use strict";

/*
 model of cone
 */
(function (JagaEngine) {
    function generator(quantityPoints, radius) {
        var current = new JagaEngine.Vector(0, 0, 0);
        var shift = (2 * Math.PI) / quantityPoints;
        for (var angle = 0, i = 0; i <= quantityPoints; angle += shift, ++i) {
            current.x = radius * Math.cos(angle);
            current.z = radius * Math.sin(angle);
            this.vectors.push(current.clone());
        }
        var last = this.vectors.length - 1;
        var first = last - quantityPoints;
        this.vectors[last] = this.vectors[first];//closure: last = first
    }

    function triangulation(start, quantityPoints, color){
        var face;
        for(var i = start; i < start + quantityPoints; ++i){
            face = Object.create(null);
            face.a = this.vectors[i];
            face.b = this.peak;
            face.c = this.vectors[i + 1];
            face.color = color;
            this.faces.push(face);
        }
    }

    JagaEngine.Cone = (function () {
        function Cone(parameters, origin) {
            this.parameters = parameters;
            this.vectors = [];
            this.faces = [];
            this.origin = origin || new Vector();
            this.state = new JagaEngine.Matrix();// total transformation
            this.matrix = new JagaEngine.Matrix();// current transformation
        }

        Cone.prototype.generateGeometry = function () {
            this.vectors = [];
            this.faces = [];
            this.peak = new JagaEngine.Vector(0, -this.parameters.height, 0);

            generator.call(this, this.parameters.majorNumber, this.parameters.innerRadius);
            generator.call(this, this.parameters.majorNumber, this.parameters.outerRadius);
            triangulation.call(this, 0,                               this.parameters.majorNumber, {r: 0, g: 0, b: 1, a: 1});
            triangulation.call(this, this.parameters.majorNumber + 1, this.parameters.majorNumber, {r: 1, g: 0, b: 0, a: 1});

            console.log("generated model. triangles: " + this.faces.length + ", vectors: " + this.vectors.length);
            this.transform(this.state);
            this.state = new JagaEngine.Matrix();
            this.commit();
        };

        Cone.prototype.drawBase = function (canvas) {
            canvas.beginPath();
            canvas.strokeStyle = this.parameters.colors.base;
            var opCurrent,//outer vertex
                ipCurrent,//inner vertex
                ipPrevious;//previous inner vertex
            for (var i = 0; i <= this.parameters.majorNumber; ++i) {
                ipCurrent = this.vectors[i];
                opCurrent = this.vectors[i + this.parameters.majorNumber];
                canvas.moveTo(ipCurrent.x, ipCurrent.y);
                canvas.lineTo(opCurrent.x, opCurrent.y);
                if (i == 0) {
                    ipPrevious = ipCurrent;
                    continue;
                }
                canvas.lineTo(ipPrevious.x, ipPrevious.y);
                ipPrevious = ipCurrent;
            }
            canvas.stroke();
        };

        Cone.prototype.project = function (drawContext, projector) {
            var self = this;
            projector.do(self.peak);
            self.vectors.forEach(function (vector, number) {
                projector.do(vector);
                if (number == 0 || number == (self.parameters.majorNumber + 1)) {
                    switch (number) {
                        case 0:
                            drawContext.beginPath();
                            drawContext.strokeStyle = self.parameters.colors.inner;
                            break;
                        case self.parameters.majorNumber + 1:
                            drawContext.stroke();
                            drawContext.beginPath();
                            drawContext.strokeStyle = self.parameters.colors.outer;
                            break;
                    }
                    drawContext.moveTo(vector.x, vector.y);
                    drawContext.lineTo(self.peak.x, self.peak.y);
                    drawContext.moveTo(vector.x, vector.y);
                    return;
                }
                drawContext.lineTo(vector.x, vector.y);
                drawContext.lineTo(self.peak.x, self.peak.y);
                drawContext.moveTo(vector.x, vector.y);
            });
            drawContext.stroke();
            self.drawBase(drawContext);

            return this;
        };

        Cone.prototype.transform = function (matrix) {
            this.matrix = matrix;
            this.peak.restore().transform(matrix);
            this.vectors.forEach(function (vector) {
                vector.restore().transform(matrix);
            });

            return this;
        };

        Cone.prototype.commit = function () {
            this.state = this.state.multiply(this.matrix);
            this.peak.commit();
            this.vectors.forEach(function (vector) {
                vector.commit();
            });

            return this;
        };

        return Cone;
    })();
})(JagaEngine);