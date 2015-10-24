"use strict"
/**
 * Created by slesh on 9/26/15.
 */

function Vector(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
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

Vector.prototype.scale = function(factor){
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;

    return this;
};

Vector.prototype.transform = function (matrix) {
    var x = this.x * matrix.v00 + this.y * matrix.v10 + this.z * matrix.v20 + this.w * matrix.v30;
    var y = this.x * matrix.v01 + this.y * matrix.v11 + this.z * matrix.v21 + this.w * matrix.v31;
    var z = this.x * matrix.v02 + this.y * matrix.v12 + this.z * matrix.v22 + this.w * matrix.v23;
    var w = this.x * matrix.v03 + this.y * matrix.v13 + this.z * matrix.v23 + this.w * matrix.v33;

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