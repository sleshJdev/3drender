/**
 * Created by slesh on 10/24/15.
 */
"use strict";

/*
 model of cone
 */
(function (JagaEngine) {
    function generator(radius) {
        var current = new JagaEngine.Vector(0, 0, 0);
        var shift = (2 * Math.PI) / this.parameters.majorNumber;
        for (var angle = 0, i = 0; i <= this.parameters.majorNumber; angle += shift, ++i) {
            current.x = radius * Math.cos(angle);
            current.z = radius * Math.sin(angle);
            this.vectors.push(current.clone());
        }
        var last = this.vectors.length - 1;
        var first = last - this.parameters.majorNumber;
        this.vectors[last] = this.vectors[first];//closure: last = first
    }

    function triangulation(start, color){
        var face;
        for(var i = start; i < start + this.parameters.majorNumber; ++i){
            face = Object.create(null);
            face.a = this.vectors[i];
            face.b = this.peak;
            face.c = this.vectors[i + 1];
            face.color = color;
            this.faces.push(face);
        }
    }

    function triangulationBase(color){
        var opCurrent,//outer vertex
            ipCurrent,//inner vertex
            ipPrevious,//previous inner vertex
            opPrevious;//previous outer vertex
        var face;
        for (var i = 0; i <= this.parameters.majorNumber; ++i) {
            ipCurrent = this.vectors[i];
            opCurrent = this.vectors[i + this.parameters.majorNumber];
            if (i == 0) {
                ipPrevious = ipCurrent;
                opPrevious = opCurrent;
                continue;
            }
            face = Object.create(null);
            face.a = ipPrevious;
            face.b = ipCurrent;
            face.c = opCurrent;
            face.color = color;
            this.faces.push(face);
            face = Object.create(null);
            face.a = opPrevious;
            face.b = opCurrent;
            face.c = ipPrevious;
            face.color = color;
            this.faces.push(face);
            ipPrevious = ipCurrent;
            opPrevious = opCurrent;
        }
        console.log(2*this.parameters.majorNumber + 2);
        console.log(this.vectors.length);
        face = Object.create(null);
        face.a = this.vectors[0];
        face.b = this.vectors[this.parameters.majorNumber + 1];
        face.c = this.vectors[2 * this.parameters.majorNumber];
        face.color = color;
        this.faces.push(face);
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
            generator.call(this, this.parameters.innerRadius);
            generator.call(this, this.parameters.outerRadius);
            triangulation.call(this, 0,                               {r: 0, g: 0, b: 1, a: 1});
            triangulation.call(this, this.parameters.majorNumber + 1, {r: 1, g: 0, b: 0, a: 1});
            triangulationBase.call(this, {r: 0, g: 1, b: 0, a: 1});
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