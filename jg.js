"use strick"
/**
 * Created by yauheni.putsykovich on 22.09.2015.
 */
function Point(x, y, z, number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.number = number;

};
Point.prototype.shift = function (dx, dy, dz) {
    this.x += dx;
    this.y += dy;
    this.z += dz;
};

Point.prototype.transform = function (matrix) {
    this.x = this.x * matrix[0][0] + this.y * matrix[0][1] + this.z * matrix[0][2] + matrix[0][3];
    this.y = this.x * matrix[1][0] + this.y * matrix[1][1] + this.z * matrix[1][2] + matrix[1][3];
    this.z = this.x * matrix[2][0] + this.y * matrix[2][1] + this.z * matrix[2][2] + matrix[2][3];
};

Point.prototype.clone = function () {
    return new Point(this.x, this.y, this.z);
};

Point.prototype.toString = function () {
    return this.number + ": {x:" + this.x + ",y:" + this.y + ",z:" + this.z + "}";
};

/*
 parameter - object properties.
 him structure looks as: {
 innerRadius: value of number,
 outerRadius: value of number,
 height: value of number
 }

 sc - object, which represent system of coordinates.
 him structure looks as: {
 center - object of Point type
 }
 */
function Conus(parameters, sc) {
    this.innerRadius = parameters.innerRadius;
    this.outerRadius = parameters.outerRadius;
    this.height = parameters.height;
    this.sc = sc;
    this.points = [];
};

/*
 parameter - object properties.
 him structure looks as: {
 outerPoints: [value of number], - the quantity of pointer on outer radius
 innerPoint: [value of number] the quantity of pointer on outer radius [value of number]
 }
 */
Conus.prototype.generatePoints = function (parameters) {
    this.intervalsDelimiter = [0, parameters.innerPoints + 1];
    this.innerPoints = parameters.innerPoints;
    this.outerPoints = parameters.outerPoints;
    var generator = function (quantityPoints, radius) {
        var current = new Point(0, this.sc.center.y, 0);
        var angleShift = (2 * Math.PI) / quantityPoints;
        for (var angle = 0, i = 0; i <= quantityPoints; angle += angleShift, ++i) {
            current.x = this.sc.center.x + radius * Math.cos(angle);
            current.z = this.sc.center.z + radius * Math.sin(angle);
            this.points.push(current.clone());
        }
        this.points[this.points.length - 1] = this.points[this.points.length - quantityPoints - 1].clone();//closure: end = first
    }
    generator.call(this, this.innerPoints, this.innerRadius);
    generator.call(this, this.outerPoints, this.outerRadius);
    this.points.push(new Point(this.sc.center.x, this.sc.center.y - this.height, this.sc.center.z));//last point is peak of conus
};

Conus.prototype.draw = function (canvas) {
    var self = this,
        peak = this.points.pop(),
        currentInterval = 0;
    canvas.beginPath();
    this.points.forEach(function (point, number) {
        if ((currentInterval = self.intervalsDelimiter.indexOf(number)) != -1) {
            canvas.moveTo(point.x, point.y);
            canvas.lineTo(peak.x, peak.y);
            canvas.moveTo(point.x, point.y);
            return;
        }
        canvas.lineTo(point.x, point.y);
        canvas.lineTo(peak.x, peak.y);
        canvas.moveTo(point.x, point.y);
    });
    canvas.stroke();
    this.points.push(peak);
};

Conus.prototype.translate = function (pointShift) {
    var matrix = [
        [1, 0, 0, pointShift.x],
        [0, 1, 0, pointShift.y],
        [0, 0, 1, pointShift.z],
        [0, 0, 0, 1],
    ];
    this.points.forEach(function (point) {
        point.transform(matrix);
    });
};

Conus.prototype.rotate = function (point, angle) {

    var matrix = [
        [1, 0, 0, 0],
        [0, cos(angle), sin(angle), 0],
        [0, -sin(angle), cos(angle), 0],
        [0, 0, 0, 1]
    ];
    //var matrix = [
    //    [ cos(angle), 0, sin(angle),  0],
    //    [          0, 1,          0,  0],
    //    [-sin(angle), 0, cos(angle),  0],
    //    [          0, 0,          0,  1]
    //];
    //var matrix = [
    //    [  cos(angle), sin(angle), 0,  0],
    //    [ -sin(angle), cos(angle), 0,  0],
    //    [           0,          0, 1,  0],
    //    [           0,          0, 0,  1]
    //];
    var matrix1 = [
        [1, 0, 0, -this.sc.center.x],
        [0, 1, 0, -this.sc.center.y],
        [0, 0, 1, -this.sc.center.z],
        [0, 0, 0, 1],
    ];
    var matrix2 = [
        [1, 0, 0, this.sc.center.x],
        [0, 1, 0, this.sc.center.y],
        [0, 0, 1, this.sc.center.z],
        [0, 0, 0, 1],
    ];
    this.points.forEach(function (point) {
        point.transform(matrix1);
        point.transform(matrix);
        point.transform(matrix2);
    });
};
