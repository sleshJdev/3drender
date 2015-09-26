/**
 * Created by slesh on 9/26/15.
 */

function Matrix(diagonalValue) {
    this.v00 = 0; this.v01 = 0; this.v02 = 0; this.v03 = 0;
    this.v10 = 0; this.v11 = 0; this.v12 = 0; this.v13 = 0;
    this.v20 = 0; this.v21 = 0; this.v22 = 0; this.v23 = 0;
    this.v30 = 0; this.v31 = 0; this.v32 = 0; this.v33 = 0;
    this.v00 = this.v11 = this.v22 = this.v33 = diagonalValue == undefined ? 1 : diagonalValue;
};

Matrix.prototype.multiplyOnMatrix = function (matrix) {
    var result = new Matrix();

    result.v00 = this.v00 * matrix.v00 + this.v01 * matrix.v10 + this.v02 * matrix.v20 + this.v03 * matrix.v30;
    result.v01 = this.v00 * matrix.v01 + this.v01 * matrix.v11 + this.v02 * matrix.v21 + this.v03 * matrix.v31;
    result.v02 = this.v00 * matrix.v02 + this.v01 * matrix.v12 + this.v02 * matrix.v22 + this.v03 * matrix.v32;
    result.v03 = this.v00 * matrix.v03 + this.v01 * matrix.v13 + this.v02 * matrix.v23 + this.v03 * matrix.v33;

    result.v10 = this.v10 * matrix.v00 + this.v11 * matrix.v10 + this.v12 * matrix.v20 + this.v13 * matrix.v30;
    result.v11 = this.v10 * matrix.v01 + this.v11 * matrix.v11 + this.v12 * matrix.v21 + this.v13 * matrix.v31;
    result.v12 = this.v10 * matrix.v02 + this.v11 * matrix.v12 + this.v12 * matrix.v22 + this.v13 * matrix.v32;
    result.v13 = this.v10 * matrix.v03 + this.v11 * matrix.v13 + this.v12 * matrix.v23 + this.v13 * matrix.v33;

    result.v20 = this.v20 * matrix.v00 + this.v21 * matrix.v10 + this.v22 * matrix.v20 + this.v23 * matrix.v30;
    result.v21 = this.v20 * matrix.v01 + this.v21 * matrix.v11 + this.v22 * matrix.v21 + this.v23 * matrix.v31;
    result.v22 = this.v20 * matrix.v02 + this.v21 * matrix.v12 + this.v22 * matrix.v22 + this.v23 * matrix.v32;
    result.v23 = this.v20 * matrix.v03 + this.v21 * matrix.v13 + this.v22 * matrix.v23 + this.v23 * matrix.v33;

    result.v30 = this.v30 * matrix.v00 + this.v31 * matrix.v10 + this.v32 * matrix.v20 + this.v33 * matrix.v30;
    result.v31 = this.v30 * matrix.v01 + this.v31 * matrix.v11 + this.v32 * matrix.v21 + this.v33 * matrix.v31;
    result.v32 = this.v30 * matrix.v02 + this.v31 * matrix.v12 + this.v32 * matrix.v22 + this.v33 * matrix.v32;
    result.v33 = this.v30 * matrix.v03 + this.v31 * matrix.v13 + this.v32 * matrix.v23 + this.v33 * matrix.v33;

    return result;
};

Matrix.prototype.multiplyOnVector = function (vector) {
    return vector.clone().transform(this);
};

Matrix.prototype.toString = function () {
    return "[[" + this.v00 + ", " + this.v01 + ", " + this.v02 + ", " + this.v03 + "]\n" +
           " [" + this.v10 + ", " + this.v11 + ", " + this.v12 + ", " + this.v13 + "]\n" +
           " [" + this.v20 + ", " + this.v21 + ", " + this.v22 + ", " + this.v23 + "]\n" +
           " [" + this.v30 + ", " + this.v31 + ", " + this.v32 + ", " + this.v33 + "]]";

};