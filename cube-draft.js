/**
 * Created by slesh on 9/27/15.
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
