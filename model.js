"use strict"
/**
 * Created by yauheni.putsykovich on 22.09.2015.
 */
//var m1 = new Matrix(0);
//m1.v00 = 2;
//m1.v01 = 1;
//m1.v02 = 4;
//m1.v10 = -4;
//m1.v11 = 1 / 2;
//m1.v12 = 3;
//
//var m2 = new Matrix(0);
//m2.v00 = 0;
//m2.v01 = 1;
//m2.v10 = -2;
//m2.v11 = 5;
//m2.v20 = -1;
//m2.v21 = 9;
//
//var v3 = m1.multiplyOnMatrix(m2);
//console.log(v3.toString());


//function Cube() {
//    this.points = [];
//
//    this.center = new Vector(200, 200, 200);
//
//    var size = 100;
//
//    this.points.push(new Vector(0, 0, 0));
//    this.points.push(new Vector(size, 0, 0));
//    this.points.push(new Vector(size, 0, size));
//    this.points.push(new Vector(0, 0, size));
//
//    this.points.push(new Vector(0, size, 0));
//    this.points.push(new Vector(size, size, 0));
//    this.points.push(new Vector(size, size, size));
//    this.points.push(new Vector(0, size, size));
//}
//
//Cube.prototype.draw = function (canvas) {
//    var self = this;
//    this.points.forEach(function (point) {
//        point.shift(self.center);
//    });
//
//    canvas.beginPath();
//    canvas.strokeStyle = "red";
//    canvas.moveTo(this.points[0].x, this.points[0].y);
//    canvas.lineTo(this.points[1].x, this.points[1].y);
//    canvas.lineTo(this.points[2].x, this.points[2].y);
//    canvas.lineTo(this.points[3].x, this.points[3].y);
//    canvas.lineTo(this.points[0].x, this.points[0].y);
//    canvas.stroke();
//
//    canvas.beginPath();
//    canvas.strokeStyle = "green";
//    canvas.moveTo(this.points[4].x, this.points[4].y);
//    canvas.lineTo(this.points[5].x, this.points[5].y);
//    canvas.lineTo(this.points[6].x, this.points[6].y);
//    canvas.lineTo(this.points[7].x, this.points[7].y);
//    canvas.lineTo(this.points[4].x, this.points[4].y);
//    canvas.stroke();
//
//    canvas.beginPath();
//    canvas.strokeStyle = "blue";
//    canvas.lineTo(this.points[4].x, this.points[4].y);
//    canvas.moveTo(this.points[0].x, this.points[0].y);
//
//    canvas.lineTo(this.points[4].x, this.points[4].y);
//    canvas.moveTo(this.points[1].x, this.points[1].y);
//
//    canvas.lineTo(this.points[5].x, this.points[5].y);
//    canvas.moveTo(this.points[2].x, this.points[2].y);
//
//    canvas.lineTo(this.points[6].x, this.points[6].y);
//    canvas.moveTo(this.points[3].x, this.points[3].y);
//
//    canvas.lineTo(this.points[7].x, this.points[7].y);
//
//    canvas.stroke();
//};
//
//Cube.prototype.rotate = function (matrix) {
//    this.points.forEach(function (point) {
//        console.log(JSON.stringify(point));
//        point.reset();
//        point.transform(matrix);
//    });
//};


/*
 parameter - object properties.
 him structure looks as: {
 innerRadius: value of number,
 outerRadius: value of number,
 height: value of number
 }

 sc - object, which represent system of coordinates.
 him structure looks as: {
 center - object of Vector type
 }
 */
function Conus(parameters) {
    this.innerRadius = parameters.innerRadius;
    this.outerRadius = parameters.outerRadius;
    this.height = parameters.height;
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
        var current = new Vector(0, 0, 0);
        var angleShift = (2 * Math.PI) / quantityPoints;
        for (var angle = 0, i = 0; i <= quantityPoints; angle += angleShift, ++i) {
            current.x = radius * Math.cos(angle);
            current.z = radius * Math.sin(angle);
            this.points.push(current.clone());
        }
        this.points[this.points.length - 1] = this.points[this.points.length - quantityPoints - 1].clone();//closure: end = first
    }
    generator.call(this, this.innerPoints, this.innerRadius);
    generator.call(this, this.outerPoints, this.outerRadius);
    this.points.push(new Vector(0, -this.height, 0));//last point is peak of conus
};

Conus.prototype.draw = function (canvas) {
    var self = this,
        peak = this.points.pop(),
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
};

Conus.prototype.transform = function (matrix) {
    this.points.forEach(function (point) {
        point.reset();
        point.transform(matrix);
    });
};
