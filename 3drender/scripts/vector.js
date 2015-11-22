/**
 * Created by slesh on 10/23/15.
 */
"use strict";

(function (JagaEngine) {
    JagaEngine.Vector = (function () {
        function Vector(initialX, initialY, initialZ) {
            this.x = initialX;
            this.y = initialY;
            this.z = initialZ;
        }

        Vector.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
        };
        Vector.prototype.add = function (otherVector) {
            return new Vector(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
        };
        Vector.prototype.subtract = function (otherVector) {
            return new Vector(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
        };
        Vector.prototype.negate = function () {
            return new Vector(-this.x, -this.y, -this.z);
        };
        Vector.prototype.scale = function (scale) {
            return new Vector(this.x * scale, this.y * scale, this.z * scale);
        };
        Vector.prototype.equals = function (otherVector) {
            return this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
        };
        Vector.prototype.multiply = function (otherVector) {
            return new Vector(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
        };
        Vector.prototype.divide = function (otherVector) {
            return new Vector(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
        };
        Vector.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector.prototype.normalize = function () {
            var len = this.length();
            if (len === 0) {
                return;
            }
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;

            return this;
        };
        Vector.FromArray = function FromArray(array, offset) {
            if (!offset) {
                offset = 0;
            }
            return new Vector(array[offset], array[offset + 1], array[offset + 2]);
        };
        Vector.Zero = function Zero() {
            return new Vector(0, 0, 0);
        };
        Vector.Up = function Up() {
            return new Vector(0, 1.0, 0);
        };
        Vector.Copy = function Copy(source) {
            return new Vector(source.x, source.y, source.z);
        };
        Vector.TransformCoordinates = function TransformCoordinates(vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            return new Vector(x / w, y / w, z / w);
        };
        Vector.TransformNormal = function TransformNormal(vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
            return new Vector(x, y, z);
        };
        Vector.Dot = function Dot(left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        Vector.Cross = function Cross(left, right) {
            var x = left.y * right.z - left.z * right.y;
            var y = left.z * right.x - left.x * right.z;
            var z = left.x * right.y - left.y * right.x;
            return new Vector(x, y, z);
        };
        Vector.Normalize = function Normalize(vector) {
            var newVector = Vector.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector.Distance = function Distance(value1, value2) {
            return Math.sqrt(Vector.DistanceSquared(value1, value2));
        };
        Vector.DistanceSquared = function DistanceSquared(value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            var z = value1.z - value2.z;
            return (x * x) + (y * y) + (z * z);
        };
        return Vector;
    })();
})(JagaEngine || (JagaEngine = Object.create(null)));

