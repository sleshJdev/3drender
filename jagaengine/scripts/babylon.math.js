var Babylon = Object.create(null);
(function (Babylon) {
    var Color4 = (function () {
        function Color4(red, green, blue, alpha) {
            this.r = red;
            this.g = green;
            this.b = blue;
            this.a = alpha;

            this.rgba = "rgba(" + 255 * red + "," + 255 * green + "," + 255 * blue + "," + alpha + ")";
        }

        Color4.prototype.toString = function () {
            return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
        };
        return Color4;
    })();
    Babylon.Color4 = Color4;

    var Vector3 = (function () {
        function Vector3(initialX, initialY, initialZ) {
            this.x = initialX;
            this.y = initialY;
            this.z = initialZ;
        }

        Vector3.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
        };
        Vector3.prototype.add = function (otherVector) {
            return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
        };
        Vector3.prototype.subtract = function (otherVector) {
            return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
        };
        Vector3.prototype.negate = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };
        Vector3.prototype.scale = function (scale) {
            return new Vector3(this.x * scale, this.y * scale, this.z * scale);
        };
        Vector3.prototype.equals = function (otherVector) {
            return this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
        };
        Vector3.prototype.multiply = function (otherVector) {
            return new Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
        };
        Vector3.prototype.divide = function (otherVector) {
            return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.normalize = function () {
            var length = this.length();
            if (length === 0) {
                return;
            }
            var factor = 1.0 / length;
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;

            return this;
        };

        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };

        Vector3.FromArray = function (array, offset) {
            if (!offset) {
                offset = 0;
            }
            return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
        };
        Vector3.Zero = function () {
            return new Vector3(0, 0, 0);
        };
        Vector3.Up = function () {
            return new Vector3(0, 1.0, 0);
        };
        Vector3.Copy = function (source) {
            return new Vector3(source.x, source.y, source.z);
        };
        Vector3.TransformCoordinates = function (vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            return new Vector3(x / w, y / w, z / w);
        };
        Vector3.TransformNormal = function (vector, transformation) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
            return new Vector3(x, y, z);
        };
        Vector3.Dot = function (left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        Vector3.Cross = function (left, right) {
            var x = left.y * right.z - left.z * right.y;
            var y = left.z * right.x - left.x * right.z;
            var z = left.x * right.y - left.y * right.x;
            return new Vector3(x, y, z);
        };
        Vector3.Normalize = function (vector) {
            var newVector = Vector3.Copy(vector);
            newVector.normalize();
            return newVector;
        };
        Vector3.Distance = function (value1, value2) {
            return Math.sqrt(Vector3.DistanceSquared(value1, value2));
        };
        Vector3.DistanceSquared = function (value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            var z = value1.z - value2.z;
            return (x * x) + (y * y) + (z * z);
        };
        return Vector3;
    })();
    Babylon.Vector3 = Vector3;

    var Matrix = (function () {
        function Matrix() {
            this.m = [];
        }

        Matrix.prototype.multiply = function (other) {
            var result = new Matrix();
            result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
            result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
            result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
            result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];
            result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
            result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
            result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
            result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];
            result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
            result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
            result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
            result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];
            result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
            result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
            result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
            result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
            return result;
        };
        Matrix.FromValues = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
            var result = new Matrix();
            result.m[0] = initialM11;
            result.m[1] = initialM12;
            result.m[2] = initialM13;
            result.m[3] = initialM14;
            result.m[4] = initialM21;
            result.m[5] = initialM22;
            result.m[6] = initialM23;
            result.m[7] = initialM24;
            result.m[8] = initialM31;
            result.m[9] = initialM32;
            result.m[10] = initialM33;
            result.m[11] = initialM34;
            result.m[12] = initialM41;
            result.m[13] = initialM42;
            result.m[14] = initialM43;
            result.m[15] = initialM44;
            return result;
        };
        Matrix.Identity = function () {
            return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
        };
        Matrix.Zero = function () {
            return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix.RotationX = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[0] = 1.0;
            result.m[15] = 1.0;
            result.m[5] = c;
            result.m[10] = c;
            result.m[9] = -s;
            result.m[6] = s;
            return result;
        };
        Matrix.RotationY = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[5] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[2] = -s;
            result.m[8] = s;
            result.m[10] = c;
            return result;
        };
        Matrix.RotationZ = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[10] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[1] = s;
            result.m[4] = -s;
            result.m[5] = c;
            return result;
        };
        Matrix.RotationAxis = function (axis, angle) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            axis.normalize();
            var result = Matrix.Zero();
            result.m[0] = (axis.x * axis.x) * c1 + c;
            result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
            result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
            result.m[5] = (axis.y * axis.y) * c1 + c;
            result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
            result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
            result.m[10] = (axis.z * axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
            return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
        };
        Matrix.Scaling = function (x, y, z) {
            var result = Matrix.Zero();
            result.m[0] = x;
            result.m[5] = y;
            result.m[10] = z;
            result.m[15] = 1.0;
            return result;
        };
        Matrix.Translation = function (x, y, z) {
            var result = Matrix.Identity();
            result.m[12] = x;
            result.m[13] = y;
            result.m[14] = z;
            return result;
        };
        Matrix.LookAtLH = function (eye, target, up) {
            var zAxis = target.subtract(eye);
            zAxis.normalize();
            var xAxis = Vector3.Cross(up, zAxis);
            xAxis.normalize();
            var yAxis = Vector3.Cross(zAxis, xAxis);
            yAxis.normalize();
            var ex = -Vector3.Dot(xAxis, eye);
            var ey = -Vector3.Dot(yAxis, eye);
            var ez = -Vector3.Dot(zAxis, eye);
            return Matrix.FromValues(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1);
        };
        Matrix.PerspectiveLH = function (width, height, znear, zfar) {
            var matrix = Matrix.Zero();
            matrix.m[0] = (2.0 * znear) / width;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = (2.0 * znear) / height;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[10] = -zfar / (znear - zfar);
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = (znear * zfar) / (znear - zfar);
            return matrix;
        };
        Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
            var matrix = Matrix.Zero();
            var tan = 1.0 / (Math.tan(fov * 0.5));
            matrix.m[0] = tan / aspect;
            matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
            matrix.m[5] = tan;
            matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
            matrix.m[8] = matrix.m[9] = 0.0;
            matrix.m[10] = -zfar / (znear - zfar);
            matrix.m[11] = 1.0;
            matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
            matrix.m[14] = (znear * zfar) / (znear - zfar);
            return matrix;
        };
        return Matrix;
    })();
    Babylon.Matrix = Matrix;
})(Babylon || (Babylon = {}));
