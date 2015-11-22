/**
 * Created by slesh on 10/23/15.
 */
"use strict";

(function (JagaEngine) {
    JagaEngine.Vector = (function () {
        function Vector(x, y, z) {
            this.x0 = x;
            this.y0 = y;
            this.z0 = z;

            this.restore();
        }

        Vector.prototype.commit = function () {
            this.x = this.x0;
            this.y = this.y0;
            this.z = this.z0;

            return this;
        };

        Vector.prototype.restore = function () {
            this.x = this.x0;
            this.y = this.y0;
            this.z = this.z0;

            return this;
        };

        Vector.prototype.transform = function (transformation) {
            var x = (this.x * transformation.m[0]) + (this.y * transformation.m[4]) + (this.z * transformation.m[8]) + transformation.m[12];
            var y = (this.x * transformation.m[1]) + (this.y * transformation.m[5]) + (this.z * transformation.m[9]) + transformation.m[13];
            var z = (this.x * transformation.m[2]) + (this.y * transformation.m[6]) + (this.z * transformation.m[10]) + transformation.m[14];
            var w = (this.x * transformation.m[3]) + (this.y * transformation.m[7]) + (this.z * transformation.m[11]) + transformation.m[15];

            this.x = x / w;
            this.y = y / w;
            this.z = z / w;

            return this;
        };

        Vector.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
        };
        Vector.prototype.add = function (otherVector) {
            this.x += otherVector.x;
            this.y += otherVector.y;
            this.z += otherVector.z;

            return this;
        };
        Vector.prototype.subtract = function (otherVector) {
            return new Vector(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
        };
        Vector.prototype.negate = function () {
            return new Vector(-this.x, -this.y, -this.z);
        };
        Vector.prototype.scale = function (scale) {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;

            return this;
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
        Vector.prototype.clone = function () {
            return new Vector(this.x, this.y, this.z);
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
            return vector.transform(transformation).clone();
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

