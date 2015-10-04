/**
 * Created by slesh on 9/26/15.
 */

function Matrix(diagonalValue) {
    this.v00 = 0; this.v01 = 0; this.v02 = 0; this.v03 = 0;
    this.v10 = 0; this.v11 = 0; this.v12 = 0; this.v13 = 0;
    this.v20 = 0; this.v21 = 0; this.v22 = 0; this.v23 = 0;
    this.v30 = 0; this.v31 = 0; this.v32 = 0; this.v33 = 0;
    this.v00 = this.v11 = this.v22 = this.v33 = 1;
}

Matrix.prototype.multiply = function (b) {
    var a = this, c = new Matrix();

    c.v00 = a.v00 * b.v00 + a.v01 * b.v10 + a.v02 * b.v20 + a.v03 * b.v30;
    c.v01 = a.v00 * b.v01 + a.v01 * b.v11 + a.v02 * b.v21 + a.v03 * b.v31;
    c.v02 = a.v00 * b.v02 + a.v01 * b.v12 + a.v02 * b.v22 + a.v03 * b.v32;
    c.v03 = a.v00 * b.v03 + a.v01 * b.v13 + a.v02 * b.v23 + a.v03 * b.v33;

    c.v10 = a.v10 * b.v00 + a.v11 * b.v10 + a.v12 * b.v20 + a.v13 * b.v30;
    c.v11 = a.v10 * b.v01 + a.v11 * b.v11 + a.v12 * b.v21 + a.v13 * b.v31;
    c.v12 = a.v10 * b.v02 + a.v11 * b.v12 + a.v12 * b.v22 + a.v13 * b.v32;
    c.v13 = a.v10 * b.v03 + a.v11 * b.v13 + a.v12 * b.v23 + a.v13 * b.v33;

    c.v20 = a.v20 * b.v00 + a.v21 * b.v10 + a.v22 * b.v20 + a.v23 * b.v30;
    c.v21 = a.v20 * b.v01 + a.v21 * b.v11 + a.v22 * b.v21 + a.v23 * b.v31;
    c.v22 = a.v20 * b.v02 + a.v21 * b.v12 + a.v22 * b.v22 + a.v23 * b.v32;
    c.v23 = a.v20 * b.v03 + a.v21 * b.v13 + a.v22 * b.v23 + a.v23 * b.v33;

    c.v30 = a.v30 * b.v00 + a.v31 * b.v10 + a.v32 * b.v20 + a.v33 * b.v30;
    c.v31 = a.v30 * b.v01 + a.v31 * b.v11 + a.v32 * b.v21 + a.v33 * b.v31;
    c.v32 = a.v30 * b.v02 + a.v31 * b.v12 + a.v32 * b.v22 + a.v33 * b.v32;
    c.v33 = a.v30 * b.v03 + a.v31 * b.v13 + a.v32 * b.v23 + a.v33 * b.v33;

    return c;
};

Matrix.prototype.multiplyOnVector = function (vector) {
    return vector.clone().transform(this);
};


Matrix.prototype.getRotateXMatrix = function (angleXRadians) {
    var sin = Math.sin(angleXRadians);
    var rotateXMatrix = new Matrix();
    rotateXMatrix.v11 = rotateXMatrix.v22 = Math.cos(angleXRadians);
    rotateXMatrix.v12 = -sin;
    rotateXMatrix.v21 = sin;

    return rotateXMatrix;
};

Matrix.prototype.getRotateYMatrix = function (angleYRadians) {
    var sin = Math.sin(angleYRadians);
    var rotateYMatrix = new Matrix();
    rotateYMatrix.v00 = rotateYMatrix.v22 = Math.cos(angleYRadians);
    rotateYMatrix.v02 = sin;
    rotateYMatrix.v20 = -sin;

    return rotateYMatrix;
};

Matrix.prototype.getRotateZMatrix = function (angleZRadians) {
    var sin = Math.sin(angleZRadians);
    var rotateZMatrix = new Matrix();
    rotateZMatrix.v00 = rotateZMatrix.v11 = Math.cos(angleZRadians);
    rotateZMatrix.v01 = -sin;
    rotateZMatrix.v10 = sin;

    return rotateZMatrix;
};

Matrix.prototype.getRotateMatrix = function (rotateVecor) {
    var matrixX = this.getRotateXMatrix(rotateVecor.x);
    var matrixY = this.getRotateYMatrix(rotateVecor.y);
    var matrixZ = this.getRotateZMatrix(rotateVecor.z);

    return matrixY.multiply(matrixX).multiply(matrixZ);
};

Matrix.prototype.getTranslateMatrix = function (translateVector) {
    var translateMatrix = new Matrix();
    translateMatrix.v03 = translateVector.x;
    translateMatrix.v13 = translateVector.y;
    translateMatrix.v23 = translateVector.z;

    return translateMatrix;
};

Matrix.prototype.getScaleMatrix = function (scaleVector) {
    var scaleMatrix = new Matrix();
    scaleMatrix.v00 = scaleVector.x;
    scaleMatrix.v11 = scaleVector.y;
    scaleMatrix.v22 = scaleVector.z;
    scaleMatrix.v33 = 1;

    return scaleMatrix;
};

Matrix.prototype.getProjectionMatrix = function (axis) {
    var projection = new Matrix();
    switch (axis.toLocaleLowerCase().trim()) {
        case "yz":
            projection.v00 = 0;
            projection.v02 = 1;
            break;
        case "xz":
            projection.v11 = 0;
            projection.v12 = 1;
            projection.v22 = 0;
            break;
        default ://xy
            projection.v22 = 0;
            break;
    }
    return projection;
};

Matrix.prototype.toString = function () {
    return  "[[" + this.v00 + ", " + this.v01 + ", " + this.v02 + ", " + this.v03 + "]\n" +
            " [" + this.v10 + ", " + this.v11 + ", " + this.v12 + ", " + this.v13 + "]\n" +
            " [" + this.v20 + ", " + this.v21 + ", " + this.v22 + ", " + this.v23 + "]\n" +
            " [" + this.v30 + ", " + this.v31 + ", " + this.v32 + ", " + this.v33 + "]]";
};
