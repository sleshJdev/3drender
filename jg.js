/**
 * Created by yauheni.putsykovich on 22.09.2015.
 */
"use strick"
window.onload = function () {
    var log = function (message) {
        console.log(message);
    };

    function Point(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };

    Point.prototype.shift = function (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

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
        this.triangles = [];
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
                this.points.push(new Point(current.x, current.y, current.z))
            }
            this.points[quantityPoints] = new Point(this.sc.center.x + radius, this.sc.center.y, this.sc.center.z);
        }

        generator.call(this, this.innerPoints, this.innerRadius);
        generator.call(this, this.outerPoints, this.outerRadius);
        this.points.push(new Point(this.sc.center.x, this.sc.center.y, this.sc.center.z));//peak
        this.points.forEach(function (item, i) {
            log(item.toSource());
        });
    };

    Conus.prototype.draw = function (canvas) {
        var self = this;
        var previous = null, peak = this.points.pop();
        var intervals = [
            { start: 0, end: 0},
            { start: 0, end: 0}
        ];
        intervals[0].end = self.innerPoints;
        intervals[1].start = self.innerPoints + 1;
        intervals[1].end = self.innerPoints + self.outerPoints + 2;

        var interval = 0;
        canvas.beginPath();
        canvas.lineWidth = 1;
        this.points.forEach(function (point, number) {
            if(number > intervals[interval].end){
                ++interval;
                canvas.closePath();
                canvas.beginPath();
            }
            if (number <= intervals[interval].end) {
                if (number == intervals[interval].start) {
                    canvas.moveTo(point.x, point.y);
                    canvas.lineTo(peak.x, peak.y);
                    canvas.moveTo(point.x, point.y);
                    return;
                }
                canvas.lineTo(point.x, point.y);
                canvas.lineTo(peak.x, peak.y);
                canvas.moveTo(point.x, point.y);
            }
        });
        canvas.stroke();
        this.points.push(peak);
    };

    var Jg = Object.create(null);

    var conus = new Conus({
        innerRadius: 50,
        outerRadius: 100,
        height: 50
    }, {
        center: new Point(100, 50, 0)
    });

    conus.generatePoints({
        innerPoints: 50,
        outerPoints: 125
    });

    conus.draw(document.querySelector("#jg-canvas").getContext("2d"));
};
