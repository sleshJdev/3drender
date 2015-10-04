/**
 * Created by slesh on 9/27/15.
 */



function Cube() {
    this.points = [];

    this.center = new Vector(200, 200, 200);

    var size = 100;

    this.points.push(new Vector(0, 0, 0));
    this.points.push(new Vector(size, 0, 0));
    this.points.push(new Vector(size, 0, size));
    this.points.push(new Vector(0, 0, size));

    this.points.push(new Vector(0, size, 0));
    this.points.push(new Vector(size, size, 0));
    this.points.push(new Vector(size, size, size));
    this.points.push(new Vector(0, size, size));
}

Cube.prototype.draw = function (canvas) {
    var self = this;
    this.points.forEach(function (point) {
        point.shift(self.center.positive());
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

    this.points.forEach(function (point) {
        point.shift(self.center.negative());
    });

    console.log("cube is drawed");
};


Cube.prototype.transform = function (angleX, angleY, angleZ) {
    var cos = Math.cos;
    var sin = Math.sin;

    var rmx = [
        [1, 0, 0, 0],
        [0, cos(angleX), sin(angleX), 0],
        [0, -sin(angleX), cos(angleX), 0],
        [0, 0, 0, 1]
    ];
    var rmy = [
        [cos(angleY), 0, -sin(angleY), 0],
        [0, 1, 0, 0],
        [-sin(angleY), 0, cos(angleY), 0],
        [0, 0, 0, 1]
    ];
    var rmz = [
        [cos(angleZ), -sin(angleZ), 0, 0],
        [sin(angleZ), cos(angleZ), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    var tm = [
        [1,0,0,10],
        [0,1,0,20],
        [0,0,1,30],
        [0,0,0,1],
    ];

    var m = mult(mult(rmx, rmy), rmz);

    this.points.forEach(function (point) {
        var v = mv(m, [point.x, point.y, point.z, 1]);
        point.x = v[0];
        point.y = v[1];
        point.z = v[2];
    });
};

function mult(a, b) {
    var result = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    var r, c;

    r = 0; c = 0; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 0; c = 1; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 0; c = 2; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 0; c = 3; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];

    r = 1; c = 0; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 1; c = 1; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 1; c = 2; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 1; c = 3; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];

    r = 2; c = 0; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 2; c = 1; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 2; c = 2; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 2; c = 3; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];

    r = 3; c = 0; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 3; c = 1; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 3; c = 2; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
    r = 3; c = 3; result[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];

    return result;
}

function mv(m, v) {
    var result = [0, 0, 0, 1];
    var k;
    k = 0; result[k] = m[k][0] * v[0] + m[k][1] * v[1] + m[k][2] * v[2] + m[k][3] * v[3];
    k = 1; result[k] = m[k][0] * v[0] + m[k][1] * v[1] + m[k][2] * v[2] + m[k][3] * v[3];
    k = 2; result[k] = m[k][0] * v[0] + m[k][1] * v[1] + m[k][2] * v[2] + m[k][3] * v[3];
    k = 3; result[k] = m[k][0] * v[0] + m[k][1] * v[1] + m[k][2] * v[2] + m[k][3] * v[3];

    return result;
}

//test
var mm1 = [
    [2, 1, 4, 0],
    [-4, 1 / 2, 3, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

var mm2 = [
    [0, 1, 0, 0],
    [-2, 5, 0, 0],
    [-1, 9, 0, 0],
    [0, 0, 0, 0]
];

//console.log("==>>>>>");
//console.log(mult(mm1, mm2));



