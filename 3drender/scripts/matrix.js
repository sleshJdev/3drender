/**
 * Created by slesh on 9/26/15.
 */

"use strict";

(function (JagaEngine) {
    JagaEngine.Matrix = (function () {
        function Matrix() {
            this.v00 = 0; this.v01 = 0; this.v02 = 0; this.v03 = 0;
            this.v10 = 0; this.v11 = 0; this.v12 = 0; this.v13 = 0;
            this.v20 = 0; this.v21 = 0; this.v22 = 0; this.v23 = 0;
            this.v30 = 0; this.v31 = 0; this.v32 = 0; this.v33 = 0;
        }

        Matrix.prototype.multiply = function (other) {
            var result = new Matrix();
            result.v00 = this.v00 * other.v00 + this.v01 * other.v10 + this.v02 * other.v20 + this.v03 * other.v30;
            result.v01 = this.v00 * other.v01 + this.v01 * other.v11 + this.v02 * other.v21 + this.v03 * other.v31;
            result.v02 = this.v00 * other.v02 + this.v01 * other.v12 + this.v02 * other.v22 + this.v03 * other.v32;
            result.v03 = this.v00 * other.v03 + this.v01 * other.v13 + this.v02 * other.v23 + this.v03 * other.v33;
            result.v10 = this.v10 * other.v00 + this.v11 * other.v10 + this.v12 * other.v20 + this.v13 * other.v30;
            result.v11 = this.v10 * other.v01 + this.v11 * other.v11 + this.v12 * other.v21 + this.v13 * other.v31;
            result.v12 = this.v10 * other.v02 + this.v11 * other.v12 + this.v12 * other.v22 + this.v13 * other.v32;
            result.v13 = this.v10 * other.v03 + this.v11 * other.v13 + this.v12 * other.v23 + this.v13 * other.v33;
            result.v20 = this.v20 * other.v00 + this.v21 * other.v10 + this.v22 * other.v20 + this.v23 * other.v30;
            result.v21 = this.v20 * other.v01 + this.v21 * other.v11 + this.v22 * other.v21 + this.v23 * other.v31;
            result.v22 = this.v20 * other.v02 + this.v21 * other.v12 + this.v22 * other.v22 + this.v23 * other.v32;
            result.v23 = this.v20 * other.v03 + this.v21 * other.v13 + this.v22 * other.v23 + this.v23 * other.v33;
            result.v30 = this.v30 * other.v00 + this.v31 * other.v10 + this.v32 * other.v20 + this.v33 * other.v30;
            result.v31 = this.v30 * other.v01 + this.v31 * other.v11 + this.v32 * other.v21 + this.v33 * other.v31;
            result.v32 = this.v30 * other.v02 + this.v31 * other.v12 + this.v32 * other.v22 + this.v33 * other.v32;
            result.v33 = this.v30 * other.v03 + this.v31 * other.v13 + this.v32 * other.v23 + this.v33 * other.v33;
            return result;
        };

        Matrix.Identity = function () {
            var matrix = new Matrix();
            matrix.v00 = matrix.v11 = matrix.v22 = matrix.v33 = 1;

            return matrix
        };

        Matrix.Zero = function () {
            return new Matrix();
        };

        Matrix.RotationX = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.v00 = 1.0;
            result.v33 = 1.0;
            result.v11 = c;
            result.v22 = c;
            result.v21 = -s;
            result.v12 = s;

            return result;
        };

        Matrix.RotationY = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.v11 = 1.0;
            result.v33 = 1.0;
            result.v00 = c;
            result.v02 = -s;
            result.v20 = s;
            result.v22 = c;

            return result;
        };

        Matrix.RotationZ = function (angle) {
            var result = Matrix.Zero();
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.v22 = 1.0;
            result.v33 = 1.0;
            result.v00 = c;
            result.v01 = s;
            result.v10 = -s;
            result.v11 = c;

            return result;
        };

        Matrix.RotationAxis = function (axis, angle) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            axis.normalize();
            var result = Matrix.Zero();
            result.v00 = (axis.x * axis.x) * c1 + c;
            result.v01 = (axis.x * axis.y) * c1 - (axis.z * s);
            result.v02 = (axis.x * axis.z) * c1 + (axis.y * s);
            result.v03 = 0.0;
            result.v10 = (axis.y * axis.x) * c1 + (axis.z * s);
            result.v11 = (axis.y * axis.y) * c1 + c;
            result.v12 = (axis.y * axis.z) * c1 - (axis.x * s);
            result.v13 = 0.0;
            result.v20 = (axis.z * axis.x) * c1 - (axis.y * s);
            result.v21 = (axis.z * axis.y) * c1 + (axis.x * s);
            result.v22 = (axis.z * axis.z) * c1 + c;
            result.v23 = 0.0;
            result.v33 = 1.0;

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
            result.v00 = vector.x;
            result.v11 = vector.y;
            result.v22 = vector.z;
            result.v33 = 1.0;
            return result;
        };

        Matrix.Translation = function (vector) {
            var result = Matrix.Identity();
            result.v30 = vector.x;
            result.v31 = vector.y;
            result.v32 = vector.z;
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
            matrix.v00 = (2.0 * znear) / width;
            matrix.v01 = matrix.v02 = matrix.v03 = 0.0;
            matrix.v11 = (2.0 * znear) / height;
            matrix.v10 = matrix.v12 = matrix.v13 = 0.0;
            matrix.v22 = -zfar / (znear - zfar);
            matrix.v20 = matrix.v21 = 0.0;
            matrix.v23 = 1.0;
            matrix.v30 = matrix.v31 = matrix.v33 = 0.0;
            matrix.v32 = (znear * zfar) / (znear - zfar);

            return matrix;
        };

        Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
            var matrix = Matrix.Zero();
            var tan = 1.0 / (Math.tan(fov * 0.5));
            matrix.v00 = tan / aspect;
            matrix.v01 = matrix.v02 = matrix.v03 = 0.0;
            matrix.v11 = tan;
            matrix.v10 = matrix.v12 = matrix.v13 = 0.0;
            matrix.v20 = matrix.v21 = 0.0;
            matrix.v22 = -zfar / (znear - zfar);
            matrix.v23 = 1.0;
            matrix.v30 = matrix.v31 = matrix.v33 = 0.0;
            matrix.v32 = (znear * zfar) / (znear - zfar);

            return matrix;
        };

        Matrix.Transpose = function (matrix) {
            var result = new Matrix();
            result.v00 = matrix.v00;
            result.v01 = matrix.v10;
            result.v02 = matrix.v20;
            result.v03 = matrix.v30;
            result.v10 = matrix.v01;
            result.v11 = matrix.v11;
            result.v12 = matrix.v21;
            result.v13 = matrix.v31;
            result.v20 = matrix.v02;
            result.v21 = matrix.v12;
            result.v22 = matrix.v22;
            result.v23 = matrix.v32;
            result.v30 = matrix.v03;
            result.v31 = matrix.v13;
            result.v32 = matrix.v23;
            result.v33 = matrix.v33;

            return result;
        };

        Matrix.Orthogonal = (function () {
            var projectionXY = Matrix.Identity();
            var projectionYZ = Matrix.Identity();
            var projectionXZ = Matrix.Identity();

            projectionYZ.v00 = 0;
            projectionYZ.v20 = 1;

            projectionXZ.v11 = 0;
            projectionXZ.v21 = 1;

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
            matrix.v00 = v1; matrix.v01 = 0; matrix.v02  = v1;
            matrix.v10 = v3; matrix.v11 = 1; matrix.v12  = v3;
            matrix.v20 =     matrix.v21 =    matrix.v22 = v2;

            return function () {
                return matrix;
            };
        })();

        Matrix.Dimetric = (function () {
            var v1 = Math.sqrt(2) / 2;
            var v2 = Math.sqrt(2 / 3);
            var matrix = Matrix.Identity();
        matrix.v00 = 1;  matrix.v01 = 0;  matrix.v02 = -v1;
            matrix.v10 = 0;  matrix.v11 = 1;  matrix.v12 = v1;
            matrix.v20 = v1; matrix.v21 = v1; matrix.v22 = v2;

            return function () {
                return matrix;
            }
        })();

        Matrix.Oblique = (function () {
            var matrix = new Matrix(0);
            matrix.v01 = matrix.v11 = matrix.v33 = 1;

            return function (oblique) {
                matrix.v20 = oblique.l * Math.cos(oblique.alpha);
                matrix.v21 = oblique.l * Math.sin(oblique.alpha);

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
