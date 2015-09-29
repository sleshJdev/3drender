"use strict"
/**
 * Created by slesh on 9/26/15.
 */

function Vector(x, y, z) {
    this.x0 = x || 0;
    this.y0 = y || 0;
    this.z0 = z || 0;
    this.reset();
};

Vector.prototype.reset = function () {
    this.x = this.x0;
    this.y = this.y0;
    this.z = this.z0;

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
    this.x = this.x < 0 ? -this.x : this.x;
    this.y = this.y < 0 ? -this.y : this.y;
    this.z = this.z < 0 ? -this.z : this.z;

    return this;
};

Vector.prototype.negative = function () {
    this.x = this.x > 0 ? -this.x : this.x;
    this.y = this.y > 0 ? -this.y : this.y;
    this.z = this.z > 0 ? -this.z : this.z;

    return this;
}

Vector.prototype.transform = function (matrix) {
    var x = this.x * matrix.v00 + this.y * matrix.v01 + this.z * matrix.v02 + matrix.v03;
    var y = this.x * matrix.v10 + this.y * matrix.v11 + this.z * matrix.v12 + matrix.v13;
    var z = this.x * matrix.v20 + this.y * matrix.v21 + this.z * matrix.v22 + matrix.v23;

    this.x = x;
    this.y = y;
    this.z = z;
};

Vector.prototype.clone = function () {
    return new Vector(this.x, this.y, this.z);
};

Vector.prototype.toString = function () {
    return "{x: " + this.x + ", y: " + this.y + ", z: " + this.z + "}";
};