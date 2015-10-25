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
        var all = this.findAllByProperty(property, value);
        return !!all ? all[0] : null;
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
        var path = [current.number];
        var hasFamily = true;
        while (stack.length > 0) {
            current = stack.pop();
            if (!hasFamily) {
                path.push(current.number);
            }
            visits[current.number] = false;
            console.log("\npop: " + current);
            var rightRoad = [];
            if (current.rightLink > 0) {
                neighbor = this.findOneByProperty("number", current.rightLink);
                if (!visits[neighbor.number]) {
                    stack.push(neighbor);
                    visits[neighbor.number] = true;
                    rightRoad.push(neighbor.number);
                    console.log("visit right: true, node: " + neighbor);
                }
            }
            neighbor = current;
            var leftRoad = [];
            while (neighbor.leftLink > 0) {
                neighbor = this.findOneByProperty("number", neighbor.leftLink);
                if (!visits[neighbor.number]) {
                    stack.push(neighbor);
                    visits[neighbor.number] = true;
                    leftRoad.push(neighbor.number);
                    console.log("visit left: true, node: " + neighbor);
                }
            }
            if (hasFamily = leftRoad.length > 0) {
                path = path.concat(leftRoad);
            } else if (hasFamily = rightRoad.length > 0) {
                path = path.concat(rightRoad);
            }
        }
        console.log("search is finished.");
        return path;
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
        $(".output").innerHTML = "";
        var formatPath = "";
        path.forEach(function (nodeNumber, index) {
            if (index == 0) {
                formatPath += nodeNumber;
                return;
            }
            formatPath += "&rarr;" + nodeNumber;
        });
        $(".output").innerHTML += "<div>" + formatPath + "</div>";
    });
};


