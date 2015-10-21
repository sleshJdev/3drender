window.onload = function () {
    function $(select) {
        return document.querySelector(select);
    }

    function NetworkNode(number, id, parent, leftLink, rightLink) {
        this.number = number;
        this.id = id;
        this.parent = parent;
        this.leftLink = leftLink;
        this.rightLink = rightLink;
    };

    NetworkNode.prototype.toString = function () {
        return JSON.stringify(this);
    };

    function Network(headers) {
        this.network = [];
        this.headers = headers;
    };

    Network.prototype.addNode = function (item) {
        this.network.push(item);
    };

    Network.prototype.fillTable = function (table) {
        var row = table.insertRow(-1);
        this.headers.forEach(function (header) {
            row.insertCell(-1).innerHTML = header;
        });
        this.network.forEach(function (item) {
            row = table.insertRow(-1);
            for (var property in item) {
                if (item.hasOwnProperty(property)) {
                    row.insertCell(-1).innerHTML = item[property];
                }
            }
        });
    };

    Network.prototype.findOneByProperty = function (property, value) {
        return this.findAllByProperty(property, value)[0];
    };

    Network.prototype.findAllByProperty = function (property, value) {
        return this.network.filter(function (node) {
            if (node.hasOwnProperty(property)) {
                return node[property] == value;
            }
        });
    };

    Network.prototype.findPath = function (parent) {
        var start = (function (self) {
            var childs = self.findAllByProperty("parent", parent);
            return childs.find(function (child) {
                var isNotInLeft = self.findAllByProperty("leftLink", child.number).length == 0;
                var isNotInRight = self.findAllByProperty("rightLink", child.number).length == 0;
                if (isNotInLeft && isNotInRight) {
                    return child;
                }
            });
        })(this);
        var neighbor, current = start;
        var stack = [current];
        var visits = Object.create(null);
        var path, paths = [];

        function visit(node) {
            if (!visits[node.number]) {
                stack.push(node);
                visits[node.number] = true;
                path.push(node.number);
                console.log("visit right: true, node: " + node);
            }
        }

        while (stack.length > 0) {
            current = stack.pop();
            path = [current.number];
            visits[current.number] = false;
            console.log("pop: " + current);
            if (current.rightLink > 0) {
                neighbor = this.findOneByProperty("number", current.rightLink);
                visit(neighbor);
            }
            neighbor = current;
            while (neighbor.leftLink > 0) {
                neighbor = this.findOneByProperty("number", neighbor.leftLink);
                visit(neighbor);
            }
            if (path.length > 1) {
                paths.push(path);
            }
        }
        console.log("search is finished.");
        return paths;
    };

    var network = new Network(["Number", "Id", "Parent", "Left Link", "Right Link"]);
    network.addNode(new NetworkNode(1, 11, 1, 2, 4));
    network.addNode(new NetworkNode(2, 111, 11, -1, -1));
    network.addNode(new NetworkNode(3, 12, 2, 5, 14));
    network.addNode(new NetworkNode(4, 12, 1, 5, 7));
    network.addNode(new NetworkNode(5, 121, 12, -1, 6));
    network.addNode(new NetworkNode(6, 122, 12, 8, -1));
    network.addNode(new NetworkNode(7, 13, 1, 12, -1));
    network.addNode(new NetworkNode(8, 1221, 122, -1, 9));
    network.addNode(new NetworkNode(9, 1222, 122, 10, -1));
    network.addNode(new NetworkNode(10, 1228, 1222, -1, 11));
    network.addNode(new NetworkNode(11, 1229, 1222, -1, -1));
    network.addNode(new NetworkNode(12, 1221, 13, -1, 13));
    network.addNode(new NetworkNode(13, 1222, 13, 10, -1));
    network.addNode(new NetworkNode(14, 21, 2, 17, -1));
    network.addNode(new NetworkNode(15, 221, 21, 16, -1));
    network.addNode(new NetworkNode(16, 1222, 221, 10, -1));
    network.addNode(new NetworkNode(17, 13, 21, 12, 15));
    network.fillTable($("#source-table"));

    $("#search-button").addEventListener("click", function () {
        var paths = network.findPath($("#start-node").value);
        $(".output").innerHTML = "";
        paths.forEach(function (path) {
            var pathDiv = "";
            path.forEach(function (nodeNumber, index) {

                if (index == 0) {
                    pathDiv += nodeNumber;
                    return;
                }
                pathDiv += "&rarr;" + nodeNumber;
            });
            $(".output").innerHTML += "<div>" + pathDiv + "</div>";
        });
    });
};


