/**
 * Created by slesh on 11/12/15.
 */

function Graph() {
    this.vertexes = [];
}

Graph.prototype.addVertex = function (vertex) {
    this.vertexes.push(vertex);
};

Graph.prototype.fillTable = function (headers, table) {
    table.innerHTML = "";
    var row = table.insertRow(-1);
    headers.forEach(function (header) {
        row.insertCell(-1).innerHTML = header;
    });
    this.vertexes.forEach(function (item) {
        row = table.insertRow(-1);
        for (var property in item) {
            if (item.hasOwnProperty(property)) {
                row.insertCell(-1).innerHTML = item[property];
            }
        }
    });
};

Graph.prototype.findOneByProperty = function (property, value) {
    var all = this.findAllByProperty(property, value);
    return !!all ? all[0] : null;
};

Graph.prototype.findAllByProperty = function (property, value) {
    return this.vertexes.filter(function (node) {
        if (node.hasOwnProperty(property)) {
            return node[property] == value;
        }
    });
};

Graph.prototype.getNeighbor = function (number) {
    return this.findOneByProperty("number", number);
};

Graph.prototype.findPath = function (parent) {
    var start = (function (graph) {
        var records = graph.findAllByProperty("parent", parent);
        return records.sort(function (a, b) {
            return a.number > b.number;
        })[0];
    })(this);

    var current,
        stack = [start],
        path = "";

    while (stack.length > 0) {
        current = stack.pop();
        path += current.number + "  ";
        if (current.hasRight()) {
            stack.push(this.getNeighbor(current.rightLink));
        }
        while (current.hasLeft()) {
            current = this.getNeighbor(current.leftLink);
            path += current.number + "  ";
            if (current.hasRight()) {
                stack.push(this.getNeighbor(current.rightLink));
            }
        }
    }

    return path;
};

Graph.prototype.buildRelations = function (parent) {
    var database = Object.create(null);
    this.vertexes.forEach(function (vertex) {
        if (!(vertex.parent in database)) {
            database[vertex.parent] = [];
        }
        database[vertex.parent].push(vertex);
    });
    var stack = [database[parent][0]],
        current = null;

    function resolveRelationFor(vertex) {
        var sons = database[vertex.id];
        var brothers = database[vertex.parent];
        vertex.rightLink = -1;
        vertex.leftLink = -1;
        if (brothers) {
            var i = brothers.indexOf(vertex);
            var hasOlderBrother = (i != -1) && ((i + 1) < brothers.length);
            if (hasOlderBrother) {
                vertex.rightLink = brothers[++i].number;
            }
        }
        if (sons) {
            vertex.leftLink = sons.length > 0 ? sons[0].number : -1;
        }
    }

    while (stack.length > 0) {
        current = stack.pop();
        resolveRelationFor(current);
        if (current.hasRight()) {
            stack.push(this.getNeighbor(current.rightLink));
        }
        while (current.hasLeft()) {
            current = this.getNeighbor(current.leftLink);
            resolveRelationFor(current);
            if (current.hasRight()) {
                stack.push(this.getNeighbor(current.rightLink));
            }
        }
    }
};

Graph.prototype.clear = function () {
    this.vertexes.forEach(function (vertex) {
        vertex.leftLink = null;
        vertex.rightLink = null;
    });
};