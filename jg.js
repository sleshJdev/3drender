"use strick"
/**
 * Created by yauheni.putsykovich on 22.09.2015.
 */
window.onload = function () {
    var DEGREES_TO_RADIANS = (Math.PI / 180);

    var log = console.log;
    var cos = Math.cos;
    var sin = Math.sin;

    function $(selector){
        return document.querySelector(selector);
    }

    function Point(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    };
    Point.prototype.shift = function (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    };

    Point.prototype.multiple = function(matrix){
        this.x = this.x * matrix[0][0] + this.y * matrix[0][1] + this.z * matrix[0][2] + matrix[0][3];
        this.y = this.x * matrix[1][0] + this.y * matrix[1][1] + this.z * matrix[1][2] + matrix[1][3];
        this.z = this.x * matrix[2][0] + this.y * matrix[2][1] + this.z * matrix[2][2] + matrix[2][3];
    };

    Point.prototype.toString = function () {
        return "context.moveTo(" + this.x + ", " + this.y + ")";
        //return "{x:" + this.x + ",y:" + this.y + ",z:" + this.z + "}";
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
        this.segments = [];
    };

    /*
     parameter - object properties.
     him structure looks as: {
     outerPoints: [value of number], - the quantity of pointer on outer radius
     innerPoint: [value of number] the quantity of pointer on outer radius [value of number]
     }
     */
    Conus.prototype.generatePoints = function (parameters) {
        this.innerPoints = parameters.innerPoints;
        this.outerPoints = parameters.outerPoints;
        function generator(quantityPoints, radius) {
            var current = new Point();
            var angleShift = 2 * Math.PI / quantityPoints;
            for (var angle = 0; angle <= 2 * Math.PI; angle += angleShift) {
                current.x = this.sc.center.x + radius * Math.cos(angle);
                current.y = this.sc.center.y + radius * Math.sin(angle);
                this.points.push(new Point(current.x, current.y, 250))
            }
            this.points.push(new Point(this.sc.center.x + radius, this.sc.center.y, 0))
        }

        generator.call(this, this.innerPoints, this.innerRadius);
        generator.call(this, this.outerPoints, this.outerRadius);
        this.points.push(new Point(this.sc.center.x, this.sc.center.y, this.sc.center.z));//peak
        //this.points.forEach(function (item, i) {
        //    log("i:" + i + " " + item.toSource());
        //});
    };

    Conus.prototype.draw = function (canvas) {
        var self = this;
        var previous = null, peak = this.points.pop();
        var delimiters = [0, self.innerPoints + 1];
        var colors = ["red", "blue"];
        var isStart = true;
        var isLast = false;
        this.points.forEach(function (point, number) {
            if (delimiters.indexOf(number) != -1) {
                if(isStart){
                    canvas.beginPath();
                    isStart = false;
                }else{
                    canvas.stroke();
                    canvas.beginPath();
                }
                canvas.strokeStyle = colors[delimiters.indexOf(number)];
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
        this.points.forEach(function(point){
            point.multiple(matrix);
        });
    };

    Conus.prototype.rotate = function (point, angle) {
        angle *= DEGREES_TO_RADIANS;
        this.translate(new Point(-this.sc.center.x, -this.sc.center.y, -this.sc.center.z));
        var matrix = [
            [1, 0,          0,           0],
            [0, cos(angle), -sin(angle), 0],
            [0, sin(angle), cos(angle),  0],
            [0, 0,          0,           1]
        ];
        this.points.forEach(function(point){
            point.multiple(matrix);
        });
        this.translate(new Point(this.sc.center.x, this.sc.center.y, this.sc.center.z));
    };

    var canvas = $("#jg-canvas");
    var context = canvas.getContext('2d');

    var conus = new Conus({
        innerRadius: 100,
        outerRadius: 200,
        height: 50
    }, {
        center: new Point(250, 250, 0)
    });

    conus.generatePoints({
        innerPoints: 50,
        outerPoints: 100
    });

    conus.draw(context);

    $("#rotate-button").addEventListener("click", function () {
        conus.rotate(new Point(50, 50), 30);
        context.clearRect(0, 0, canvas.width, canvas.height);
        conus.draw(context);
    });
};
