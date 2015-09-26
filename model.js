"use strict"
/**
 * Created by yauheni.putsykovich on 22.09.2015.
 */
/*
 parameter - object properties.
 him structure looks as: {
 majorNumber: number of point on outer and inner on base circle,
 height: value of number
 }

 sc - object, which represent system of coordinates.
 him structure looks as: {
 center - object of Vector type
 }
 */
function Cone(parameters) {
    this.colors = parameters.colors;
};

/*
 parameter - object properties.
 him structure looks as: {
 outerPoints: [value of number], - the quantity of pointer on outer radius
 innerPoint: [value of number] the quantity of pointer on outer radius [value of number]
 }
 */
Cone.prototype.generateGeometry = function (parameters) {
    this.points = [];
    this.height = parameters.height;
    this.majorNumber = parameters.majorNumber;
    this.innerRadius = parameters.innerRadius;
    this.outerRadius = parameters.outerRadius;
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
    generator.call(this, this.majorNumber, this.innerRadius);
    generator.call(this, this.majorNumber, this.outerRadius);
    this.points.push(new Vector(0, -this.height, 0));//last point is peak of cone
};

Cone.prototype.drawBase = function (canvas) {
    canvas.beginPath();
    canvas.strokeStyle = this.colors.base;
    var opCurrent, ipCurrent, ipPrevious;//outer point and inner point
    for(var i = 0; i <= this.majorNumber; ++i){
        ipCurrent = this.points[i]
        opCurrent = this.points[i + this.majorNumber];
        canvas.moveTo(ipCurrent.x, ipCurrent.y);
        canvas.lineTo(opCurrent.x, opCurrent.y);
        if(i == 0){
            ipPrevious = ipCurrent;
            continue;
        }
        canvas.lineTo(ipPrevious.x, ipPrevious.y);
        ipPrevious = ipCurrent;
    }
    canvas.stroke();
};

Cone.prototype.draw = function (canvas) {
    var self = this,
        peak = this.points.pop(),
        currentInterval = 0;
    canvas.strokeStyle = "white";
    this.points.forEach(function (point, number) {
        if (number == 0 || number == (self.majorNumber + 1)) {
            if(number == 0){
                canvas.beginPath();
                canvas.strokeStyle = self.colors.inner;
            }else if(number == (self.majorNumber + 1)){
                canvas.stroke();
                canvas.beginPath();
                canvas.strokeStyle = self.colors.outer;
            }
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
    this.drawBase(canvas);
};

Cone.prototype.transform = function (matrix) {
    this.points.forEach(function (point) {
        point.reset();
        point.transform(matrix);
    });
};
