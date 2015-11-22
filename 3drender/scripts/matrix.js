/**
 * Created by slesh on 9/26/15.
 */

"use strict";

(function (JagaEngine) {
    JagaEngine.Matrix = (function () {
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

        Matrix.FromValues = function (v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, f23, v30, v31, v32, v33) {
            var result = new Matrix();
            result.m[0] = v00;
            result.m[1] = v01;
            result.m[2] = v02;
            result.m[3] = v03;
            result.m[4] = v10;
            result.m[5] = v11;
            result.m[6] = v12;
            result.m[7] = v13;
            result.m[8] = v20;
            result.m[9] = v21;
            result.m[10] = v22;
            result.m[11] = f23;
            result.m[12] = v30;
            result.m[13] = v31;
            result.m[14] = v32;
            result.m[15] = v33;

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

        Matrix.RotationYawPitchRoll = function (vector) {
            var yaw = vector.y;
            var pitch = vector.x;
            var roll = vector.z;

            return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
        };

        Matrix.Scaling = function (vector) {
            var result = Matrix.Zero();
            result.m[0] = vector.x;
            result.m[5] = vector.y;
            result.m[10] = vector.z;
            result.m[15] = 1.0;
            return result;
        };

        Matrix.Translation = function (vector) {
            var result = Matrix.Identity();
            result.m[12] = vector.x;
            result.m[13] = vector.y;
            result.m[14] = vector.z;
            return result;
        };

        Matrix.LookAtLH = function (eye, target, up) {
            var zAxis = target.subtract(eye);
            zAxis.normalize();
            var xAxis = JagaEngine.Vector3.Cross(up, zAxis);
            xAxis.normalize();
            var yAxis = JagaEngine.Vector3.Cross(zAxis, xAxis);
            yAxis.normalize();
            var ex = -JagaEngine.Vector3.Dot(xAxis, eye);
            var ey = -JagaEngine.Vector3.Dot(yAxis, eye);
            var ez = -JagaEngine.Vector3.Dot(zAxis, eye);

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

        Matrix.Transpose = function (matrix) {
            var result = new Matrix();
            result.m[0] = matrix.m[0];
            result.m[1] = matrix.m[4];
            result.m[2] = matrix.m[8];
            result.m[3] = matrix.m[12];
            result.m[4] = matrix.m[1];
            result.m[5] = matrix.m[5];
            result.m[6] = matrix.m[9];
            result.m[7] = matrix.m[13];
            result.m[8] = matrix.m[2];
            result.m[9] = matrix.m[6];
            result.m[10] = matrix.m[10];
            result.m[11] = matrix.m[14];
            result.m[12] = matrix.m[3];
            result.m[13] = matrix.m[7];
            result.m[14] = matrix.m[11];
            result.m[15] = matrix.m[15];

            return result;
        };

        Matrix.Orthogonal = (function () {
            var projectionXY = Matrix.Identity();
            var projectionYZ = Matrix.Identity();
            var projectionXZ = Matrix.Identity();

            projectionYZ.m[0] = 0;
            projectionYZ.m[8] = 1;

            projectionXZ.m[5] = 0;
            projectionXZ.m[9] = 1;

            var projections = new Object(null);
            projections.xy = projectionXY;
            projections.yz = projectionYZ;
            projections.xz = projectionXZ;

            return function (axes) {
                return projections[axes.toLowerCase().trim()];
            };
        })();

        Matrix.Isometric = (function () {
            var v1 =  Math.sqrt(3) / 2;
            var v2 =  1 / Math.sqrt(3);
            var v3 = -1 / 2;
            var matrix = Matrix.Identity();
            matrix.m[0] = v1; matrix.m[1] = 0; matrix.m[2]  = v1;
            matrix.m[4] = v3; matrix.m[5] = 1; matrix.m[6]  = v3;
            matrix.m[8] =     matrix.m[9] =    matrix.m[10] = v2;

            return function () {
                return matrix;
            };
        })();

        Matrix.Dimetric = (function () {
            var v1 = Math.sqrt(2) / 2;
            var v2 = Math.sqrt(2 / 3);
            var matrix = Matrix.Identity();
            matrix.m[0] = 1;  matrix.m[1] = 0;  matrix.m[2] = -v1;
            matrix.m[4] = 0;  matrix.m[5] = 1;  matrix.m[6] = v1;
            matrix.m[8] = v1; matrix.m[9] = v1; matrix.m[10] = v2;

            return function () {
                return matrix;
            }
        })();

        Matrix.Oblique = (function () {
            var matrix = new Matrix(0);
            matrix.m[1] = matrix.m[5] = matrix.m[15] = 1;

            return function (oblique) {
                matrix.m[8] = oblique.l * Math.cos(oblique.alpha);
                matrix.m[9] = oblique.l * Math.sin(oblique.alpha);

                return matrix;
            }
        })();

        Matrix.Perspective = (function () {
            var matrix = new Matrix();

            return function (perspective) {
                matrix.v23 = 1 / perspective.distance;

                return matrix;
            }
        })();

        return Matrix;
    })();
})(JagaEngine || (JagaEngine = Object.create(null)));
