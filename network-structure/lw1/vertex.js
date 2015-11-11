/**
 * Created by slesh on 11/12/15.
 */

function Vertex(number, id, parent, leftLink, rightLink) {
    this.number = number;
    this.id = id;
    this.parent = parent;
    this.leftLink = leftLink;
    this.rightLink = rightLink;
}

Vertex.prototype.toString = function () {
    return JSON.stringify(this);
};

Vertex.prototype.hasLeft = function () {
    return this.leftLink > 0;
};

Vertex.prototype.hasRight = function () {
    return this.rightLink > 0;
};