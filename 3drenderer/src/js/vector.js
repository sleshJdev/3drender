"use strict"
/**
 * Created by slesh on 9/26/15.
 */

function Vector(x, y, z, w) {
    this.x0 = x || 0;
    this.y0 = y || 0;
    this.z0 = z || 0;
    this.w0 = w || 1;

    this.origin();
};

Vector.prototype.origin = function () {
    this.x = this.x0;
    this.y = this.y0;
    this.z = this.z0;
    this.w = this.w0;

    return this;
};

Vector.prototype.move = function (vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;


    return this;
};

Vector.prototype.shift = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;

    return this;
};

Vector.prototype.positive = function () {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);

    return this;
};

Vector.prototype.negative = function () {
    this.x = -Math.abs(this.x);
    this.y = -Math.abs(this.y);
    this.z = -Math.abs(this.z);

    return this;
};

Vector.prototype.scale = function(factor){
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;

    return this;
};

Vector.prototype.transform = function (matrix) {
    var x = this.x * matrix.v00 + this.y * matrix.v01 + this.z * matrix.v02 + this.w * matrix.v03;
    var y = this.x * matrix.v10 + this.y * matrix.v11 + this.z * matrix.v12 + this.w * matrix.v13;
    var z = this.x * matrix.v20 + this.y * matrix.v21 + this.z * matrix.v22 + this.w * matrix.v23;
    var w = this.x * matrix.v30 + this.y * matrix.v31 + this.z * matrix.v32 + this.w * matrix.v33;

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    return this;
};

Vector.prototype.clone = function () {
    return new Vector(this.x, this.y, this.z);
};

Vector.prototype.toString = function () {
    return "{x: " + this.x + ", y: " + this.y + ", z: " + this.z + "}";
};