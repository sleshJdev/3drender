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

        Vector.Up = function() {
            return new Vector(0, 1.0, 0);
        };

        Vector.Copy = function Copy(source) {
            return new Vector(source.x, source.y, source.z);
        };

        Vector.TransformCoordinates = function TransformCoordinates(vector, transformation) {
            var x = (vector.x * transformation.v00) + (vector.y * transformation.v10) + (vector.z * transformation.v20) + transformation.v30;
            var y = (vector.x * transformation.v01) + (vector.y * transformation.v11) + (vector.z * transformation.v21) + transformation.v31;
            var z = (vector.x * transformation.v02) + (vector.y * transformation.v12) + (vector.z * transformation.v22) + transformation.v32;
            var w = (vector.x * transformation.v03) + (vector.y * transformation.v13) + (vector.z * transformation.v23) + transformation.v33;
            return new Vector(x / w, y / w, z / w);
        };

        Vector.TransformNormal = function TransformNormal(vector, transformation) {
            var x = (vector.x * transformation.v00) + (vector.y * transformation.v10) + (vector.z * transformation.v20);
            var y = (vector.x * transformation.v01) + (vector.y * transformation.v11) + (vector.z * transformation.v21);
            var z = (vector.x * transformation.v02) + (vector.y * transformation.v12) + (vector.z * transformation.v22);

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
