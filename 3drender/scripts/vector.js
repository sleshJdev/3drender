/**
 * Created by slesh on 10/23/15.
 */

(function (JagaEngine) {
    JagaEngine.Vector = (function () {
        function Vector(x, y, z, w) {
            this.x0 = x || 0;
            this.y0 = y || 0;
            this.z0 = z || 0;
            this.w0 = w || 1;

            this.restore();
        }

        Vector.prototype.commit = function () {
            this.x0 = this.x;
            this.y0 = this.y;
            this.z0 = this.z;
            this.w0 = this.w;

            return this;
        };

        Vector.prototype.restore = function () {
            this.x = this.x0;
            this.y = this.y0;
            this.z = this.z0;
            this.w = this.w0;

            return this;
        };

        Vector.prototype.add = function (vector) {
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

        Vector.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;

            return this;
        };

        Vector.prototype.cross = function (left, right) {
            var x = left.y * right.z - left.z * right.y;
            var y = left.z * right.x - left.x * right.z;
            var z = left.x * right.y - left.y * right.x;

            return new Vector(x, y, z);
        };

        Vector.prototype.transform = function (matrix) {
            var x = this.x * matrix.v00 + this.y * matrix.v10 + this.z * matrix.v20 + this.w * matrix.v30;
            var y = this.x * matrix.v01 + this.y * matrix.v11 + this.z * matrix.v21 + this.w * matrix.v31;
            var z = this.x * matrix.v02 + this.y * matrix.v12 + this.z * matrix.v22 + this.w * matrix.v32;
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

        return Vector;
    })();
})(JagaEngine);
