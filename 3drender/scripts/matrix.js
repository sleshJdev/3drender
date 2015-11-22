/**
 * Created by slesh on 9/26/15.
 */

"use strict";

(function (JagaEngine) {
    JagaEngine.Matrix = (function () {
        function Matrix(diagonalValue) {
            this.v00 = 0; this.v01 = 0; this.v02 = 0; this.v03 = 0;
            this.v10 = 0; this.v11 = 0; this.v12 = 0; this.v13 = 0;
            this.v20 = 0; this.v21 = 0; this.v22 = 0; this.v23 = 0;
            this.v30 = 0; this.v31 = 0; this.v32 = 0; this.v33 = 0;
            this.v00 = this.v11 = this.v22 = this.v33 = diagonalValue == undefined ? 1 : diagonalValue;
        }

        Matrix.FromValues = function FromValues(v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33) {
            var result = new Matrix();
            result.v00 = v00;
            result.v01 = v01;
            result.v02 = v02;
            result.v03 = v03;
            result.v10 = v10;
            result.v11 = v11;
            result.v12 = v12;
            result.v13 = v13;
            result.v20 = v20;
            result.v21 = v21;
            result.v22 = v22;
            result.v23 = v23;
            result.v30 = v30;
            result.v31 = v31;
            result.v32 = v32;
            result.v33 = v33;

            return result;
        };

        Matrix.prototype.multiply = function (m) {
            var n = this, r = new Matrix();

            r.v00 = n.v00 * m.v00 + n.v01 * m.v10 + n.v02 * m.v20 + n.v03 * m.v30;
            r.v01 = n.v00 * m.v01 + n.v01 * m.v11 + n.v02 * m.v21 + n.v03 * m.v31;
            r.v02 = n.v00 * m.v02 + n.v01 * m.v12 + n.v02 * m.v22 + n.v03 * m.v32;
            r.v03 = n.v00 * m.v03 + n.v01 * m.v13 + n.v02 * m.v23 + n.v03 * m.v33;

            r.v10 = n.v10 * m.v00 + n.v11 * m.v10 + n.v12 * m.v20 + n.v13 * m.v30;
            r.v11 = n.v10 * m.v01 + n.v11 * m.v11 + n.v12 * m.v21 + n.v13 * m.v31;
            r.v12 = n.v10 * m.v02 + n.v11 * m.v12 + n.v12 * m.v22 + n.v13 * m.v32;
            r.v13 = n.v10 * m.v03 + n.v11 * m.v13 + n.v12 * m.v23 + n.v13 * m.v33;

            r.v20 = n.v20 * m.v00 + n.v21 * m.v10 + n.v22 * m.v20 + n.v23 * m.v30;
            r.v21 = n.v20 * m.v01 + n.v21 * m.v11 + n.v22 * m.v21 + n.v23 * m.v31;
            r.v22 = n.v20 * m.v02 + n.v21 * m.v12 + n.v22 * m.v22 + n.v23 * m.v32;
            r.v23 = n.v20 * m.v03 + n.v21 * m.v13 + n.v22 * m.v23 + n.v23 * m.v33;

            r.v30 = n.v30 * m.v00 + n.v31 * m.v10 + n.v32 * m.v20 + n.v33 * m.v30;
            r.v31 = n.v30 * m.v01 + n.v31 * m.v11 + n.v32 * m.v21 + n.v33 * m.v31;
            r.v32 = n.v30 * m.v02 + n.v31 * m.v12 + n.v32 * m.v22 + n.v33 * m.v32;
            r.v33 = n.v30 * m.v03 + n.v31 * m.v13 + n.v32 * m.v23 + n.v33 * m.v33;

            return r;
        };

        Matrix.RotateX = function (angleXRadians) {
            var sin = Math.sin(angleXRadians);
            var cos = Math.cos(angleXRadians);
            var rotateXMatrix = new Matrix();
            rotateXMatrix.v11 =  cos; rotateXMatrix.v12 = sin;
            rotateXMatrix.v21 = -sin; rotateXMatrix.v22 = cos;

            return rotateXMatrix;
        };

        Matrix.RotateY = function (angleYRadians) {
            var sin = Math.sin(angleYRadians);
            var cos = Math.cos(angleYRadians);
            var rotateYMatrix = new Matrix();
            rotateYMatrix.v00 = cos; rotateYMatrix.v02 = -sin;
            rotateYMatrix.v20 = sin; rotateYMatrix.v22 =  cos;

            return rotateYMatrix;
        };

        Matrix.RotateZ = function (angleZRadians) {
            var sin = Math.sin(angleZRadians);
            var cos = Math.cos(angleZRadians);
            var rotateZMatrix = new Matrix();
            rotateZMatrix.v00 =  cos; rotateZMatrix.v01 = sin;
            rotateZMatrix.v10 = -sin; rotateZMatrix.v11 = cos;

            return rotateZMatrix;
        };

        Matrix.Rotation = function (rotateVector) {
            var matrixX = this.RotateX(rotateVector.x);
            var matrixY = this.RotateY(rotateVector.y);
            var matrixZ = this.RotateZ(rotateVector.z);

            return matrixZ.multiply(matrixX).multiply(matrixY);
        };

        Matrix.Translation = function (translateVector) {
            var translateMatrix = new Matrix();
            translateMatrix.v30 = translateVector.x;
            translateMatrix.v31 = translateVector.y;
            translateMatrix.v32 = translateVector.z;
            translateMatrix.v33 = 1;

            return translateMatrix;
        };

        Matrix.Scaling = function (scaleVector) {
            var scaleMatrix = new Matrix();
            scaleMatrix.v00 = scaleVector.x;
            scaleMatrix.v11 = scaleVector.y;
            scaleMatrix.v22 = scaleVector.z;
            scaleMatrix.v33 = scaleVector.w;

            return scaleMatrix;
        };

        Matrix.Orthogonal = (function () {
            var projectionXY = new Matrix();
            var projectionYZ = new Matrix();
            var projectionXZ = new Matrix();

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
            var matrix = new Matrix();
            matrix.v00 = v1; matrix.v01 = 0; matrix.v02 = v1;
            matrix.v10 = v3; matrix.v11 = 1; matrix.v12 = v3;
            matrix.v20 =     matrix.v21 =    matrix.v22 = v2;

            return function () {
                return matrix;
            };
        })();

        Matrix.Dimetric = (function () {
            var v1 = Math.sqrt(2) / 2;
            var v2 = Math.sqrt(2 / 3);
            var matrix = new Matrix();
            matrix.v00 = 1;  matrix.v01 = 0;  matrix.v02 = -v1;
            matrix.v10 = 0;  matrix.v11 = 1;  matrix.v12 = v1;
            matrix.v20 = v1; matrix.v21 = v1; matrix.v22 = v2;

            return function () {
                return matrix;
            }
        })();

        Matrix.getOblique = (function () {
            var matrix = new Matrix(0);
            matrix.v00 = matrix.v11 = matrix.v33 = 1;

            return function (oblique) {
                matrix.v20 = oblique.l * Math.cos(oblique.alpha);
                matrix.v21 = oblique.l * Math.sin(oblique.alpha);

                return matrix;
            }
        })();

        Matrix.LookAtLH = function LookAtLH(eye, target, up) {
            var zAxis = target.subtract(eye);
            zAxis.normalize();
            var xAxis = JagaEngine.Vector.Cross(up, zAxis);
            xAxis.normalize();
            var yAxis = JagaEngine.Vector.Cross(zAxis, xAxis);
            yAxis.normalize();
            var ex = -JagaEngine.Vector.Dot(xAxis, eye);
            var ey = -JagaEngine.Vector.Dot(yAxis, eye);
            var ez = -JagaEngine.Vector.Dot(zAxis, eye);

            return Matrix.FromValues(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1);
        };
        Matrix.PerspectiveLH = function(width, height, znear, zfar) {
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

        Matrix.PerspectiveFovLH = function(fov, aspect, znear, zfar) {
            var matrix = new Matrix(0);
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

        Matrix.perspective = (function () {
            var matrix = new Matrix();

            return function (perspective) {
                matrix.v23 = 1 / perspective.distance;

                return matrix;
            }
        })();

        Matrix.prototype.toString = function () {
            return  "[_[" + this.v00 + ", " + this.v01 + ", " + this.v02 + ", " + this.v03 + "]\n" +
                "__[" + this.v10 + ", " + this.v11 + ", " + this.v12 + ", " + this.v13 + "]\n" +
                "__[" + this.v20 + ", " + this.v21 + ", " + this.v22 + ", " + this.v23 + "]\n" +
                "__[" + this.v30 + ", " + this.v31 + ", " + this.v32 + ", " + this.v33 + "]]";
        };

        return Matrix;
    })();
})(JagaEngine);

//multiplication test
//var m = null;
//var m1 = new Matrix();
//var m2 = new Matrix();
//
//function init(m){
//    m.v00 = 1; m.v01 = 2; m.v02 = 3; m.v03 = 4;
//    m.v10 = 5; m.v11 = 6; m.v12 = 7; m.v13 = 8;
//    m.v20 = 9; m.v21 = 10; m.v22 = 11; m.v23 = 12;
//    m.v30 = 13; m.v31 = 14; m.v32 = 15; m.v33 = 16;
//}
//init(m1);
//init(m2);
//var m3 = m1.multiply(m2);
//console.log(m1.toString());
//console.log(m2.toString());
//console.log(m3.toString());
