"use strick"
/**
 * Created by yauheni.putsykovich on 22.09.2015.
 */
var DEGREES_TO_RADIANS = Math.PI / 180;
var RADIANS_TO_DEGREES = 180 / Math.PI;

function Point(x, y, z) {
    this.x0 = x || 0;
    this.y0 = y || 0;
    this.z0 = z || 0;
    this.reset();

};

Point.prototype.reset = function () {
    this.x = this.x0;
    this.y = this.y0;
    this.z = this.z0;
};

Point.prototype.shift = function (dx, dy, dz) {
    this.x += dx;
    this.y += dy;
    this.z += dz;
};

Point.prototype.transform = function (matrix) {
    this.x = this.x0 * matrix.m[0][0] + this.y0 * matrix.m[0][1] + this.z0 * matrix.m[0][2] + matrix.m[0][3];
    this.y = this.x0 * matrix.m[1][0] + this.y0 * matrix.m[1][1] + this.z0 * matrix.m[1][2] + matrix.m[1][3];
    this.z = this.x0 * matrix.m[2][0] + this.y0 * matrix.m[2][1] + this.z0 * matrix.m[2][2] + matrix.m[2][3];
};

Point.prototype.clone = function () {
    return new Point(this.x, this.y, this.z);
};

Point.prototype.toString = function () {
    return JSON.stringify(this);
};

function Matrix() {
    this.m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
};

Matrix.prototype.multiplyOnMatrix = function (matrix) {
    var result = new Matrix();
    for(var i = 0; i < 4; ++i){
        result.m[i][i] = 0;
    }
    for (var i = 0; i < 4; ++i) {
        for (var j = 0; j < 4; ++j) {
            for (var k = 0; k < 4; ++k) {
                result.m[i][j] += this.m[i][k] * matrix.m[k][j];
            }
        }
    }
    return result;
};

Matrix.prototype.multiplyOnVector = function () {

};

var m1 = new Matrix();
m1.m[0][0] = 2;
m1.m[0][1] = 1;
m1.m[0][2] = 4;
m1.m[1][0] = -4;
m1.m[1][1] = 1 / 2;
m1.m[1][2] = 3;

var m2 = new Matrix();
m2.m[0][0] = 0;
m2.m[0][1] = 1;
m2.m[1][0] = -2;
m2.m[1][1] = 5;
m2.m[2][0] = -1;
m2.m[2][1] = 9;

var v3 = m1.multiplyOnMatrix(m2);
console.log(JSON.stringify(v3));


function Cube() {
    this.points = [];

    this.center = new Point(200, 200, 200);

    var size = 100;

    this.points.push(new Point(0, 0, 0));
    this.points.push(new Point(size, 0, 0));
    this.points.push(new Point(size, 0, size));
    this.points.push(new Point(0, 0, size));

    this.points.push(new Point(0, size, 0));
    this.points.push(new Point(size, size, 0));
    this.points.push(new Point(size, size, size));
    this.points.push(new Point(0, size, size));
}

Cube.prototype.draw = function (canvas) {
    var self = this;
    this.points.forEach(function (point) {
        point.shift(self.center.x, self.center.y, self.center.z);
    });


    canvas.beginPath();
    canvas.strokeStyle = "red";
    canvas.moveTo(this.points[0].x, this.points[0].y);
    canvas.lineTo(this.points[1].x, this.points[1].y);
    canvas.lineTo(this.points[2].x, this.points[2].y);
    canvas.lineTo(this.points[3].x, this.points[3].y);
    canvas.lineTo(this.points[0].x, this.points[0].y);
    canvas.stroke();

    canvas.beginPath();
    canvas.strokeStyle = "green";
    canvas.moveTo(this.points[4].x, this.points[4].y);
    canvas.lineTo(this.points[5].x, this.points[5].y);
    canvas.lineTo(this.points[6].x, this.points[6].y);
    canvas.lineTo(this.points[7].x, this.points[7].y);
    canvas.lineTo(this.points[4].x, this.points[4].y);
    canvas.stroke();

    canvas.beginPath();
    canvas.strokeStyle = "blue";
    canvas.lineTo(this.points[4].x, this.points[4].y);
    canvas.moveTo(this.points[0].x, this.points[0].y);

    canvas.lineTo(this.points[4].x, this.points[4].y);
    canvas.moveTo(this.points[1].x, this.points[1].y);

    canvas.lineTo(this.points[5].x, this.points[5].y);
    canvas.moveTo(this.points[2].x, this.points[2].y);

    canvas.lineTo(this.points[6].x, this.points[6].y);
    canvas.moveTo(this.points[3].x, this.points[3].y);

    canvas.lineTo(this.points[7].x, this.points[7].y);

    canvas.stroke();
};

Cube.prototype.rotate = function (matrix) {
    this.points.forEach(function (point) {
        console.log(JSON.stringify(point));
        point.reset();
        point.transform(matrix);
    });
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
        var current = new Point();
        var angleShift = (2 * Math.PI) / quantityPoints;
        for (var angle = 0, i = 0; i <= quantityPoints; angle += angleShift, ++i) {
            current.x = radius * Math.cos(angle);
            current.y = 0;
            current.z = radius * Math.sin(angle);
            this.points.push(current.clone());
        }
        this.points[this.points.length - 1] = this.points[this.points.length - quantityPoints - 1].clone();//closure: end = first
    }
    generator.call(this, this.innerPoints, this.innerRadius);
    generator.call(this, this.outerPoints, this.outerRadius);
    this.points.push(new Point(0, -this.height));//last point is peak of conus
};

Conus.prototype.draw = function (canvas) {
    var self = this;
    this.points.forEach(function (point) {
        point.shift(self.sc.center.x, self.sc.center.y, self.sc.center.z);
    });
    var peak = this.points.pop(),
        currentInterval = 0;
    canvas.beginPath();
    canvas.strokeStyle = "black";
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

    //canvas.beginPath();
    //canvas.strokeStyle = "red";
    //canvas.moveTo(0, 0);
    //canvas.lineTo(peak.x, peak.y);
    //canvas.stroke();
    //
    //canvas.beginPath();
    //canvas.strokeStyle = "green";
    //canvas.moveTo(0, 0);
    //canvas.lineTo(this.sc.center.x, this.sc.center.y);
    //canvas.stroke();
    //
    //canvas.beginPath();
    //canvas.strokeStyle = "blue";
    //canvas.moveTo(0, 0);
    //canvas.lineTo(this.points[2].x, this.points[2].y);
    //canvas.stroke();
};

Conus.prototype.rotate = function (matrix) {
    this.points.forEach(function (point) {
        console.log(JSON.stringify(point));
        point.reset();
        point.transform(matrix);
    });
};
