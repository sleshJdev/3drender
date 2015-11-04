/**
 * Created by slesh on 10/24/15.
 */

function Cone(parameters, origin) {
    this.parameters = parameters;
    this.vectors = [];
    this.origin = origin || new Vector();
    this.totalTransformation = new Matrix();
    this.currentTransformation = new Matrix();
}

Cone.prototype.generateGeometry = function () {
    this.vectors = [];
    this.peak = new Vector(0, -this.parameters.height, 0);
    var generator = function (quantityPoints, radius) {
        var current = new Vector(0, 0, 0);
        var shift = (2 * Math.PI) / quantityPoints;

        for (var angle = 0, i = 0; i <= quantityPoints; angle += shift, ++i) {
            current.x = radius * Math.cos(angle);
            current.z = radius * Math.sin(angle);
            this.vectors.push(current.clone());
        }

        var last = this.vectors.length - 1;
        var first = last - quantityPoints;
        this.vectors[last] = this.vectors[first].clone();//closure: last = first
    };
    generator.call(this, this.parameters.majorNumber, this.parameters.innerRadius);
    generator.call(this, this.parameters.majorNumber, this.parameters.outerRadius);

    this.transform(this.totalTransformation);
    this.currentTransformation = new Matrix();
    this.commit();
};

Cone.prototype.drawBase = function (canvas) {
    canvas.beginPath();
    canvas.strokeStyle = this.parameters.colors.base;
    var opCurrent, ipCurrent, ipPrevious;//outer point and inner point
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

Cone.prototype.project = function (canvas, projection) {
    var self = this;
    self.peak.restore().transform(projection);
    self.vectors.forEach(function (vector, number) {
        vector.restore().transform(projection);
        if (number == 0 || number == (self.parameters.majorNumber + 1)) {
            switch (number) {
                case 0:
                    canvas.beginPath();
                    canvas.strokeStyle = self.parameters.colors.inner;
                    break;
                case self.parameters.majorNumber + 1:
                    canvas.stroke();
                    canvas.beginPath();
                    canvas.strokeStyle = self.parameters.colors.outer;
                    break;
            }
            canvas.moveTo(vector.x, vector.y);
            canvas.lineTo(self.peak.x, self.peak.y);
            canvas.moveTo(vector.x, vector.y);
            return;
        }
        canvas.lineTo(vector.x, vector.y);
        canvas.lineTo(self.peak.x, self.peak.y);
        canvas.moveTo(vector.x, vector.y);
    });
    canvas.stroke();
    self.drawBase(canvas);

    return this;
};

Cone.prototype.transform = function (matrix) {
    this.currentTransformation = matrix;
    this.peak.restore().transform(matrix);
    this.vectors.forEach(function (vector) {
        vector.restore().transform(matrix);
    });

    return this;
};

Cone.prototype.commit = function () {
    this.totalTransformation = this.totalTransformation.multiply(this.currentTransformation);
    this.peak.commit();
    this.vectors.forEach(function (vector) {
        vector.commit();
    });

    return this;
};