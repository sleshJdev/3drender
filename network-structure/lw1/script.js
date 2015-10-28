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

    NetworkNode.prototype.hasLeft = function () {
        return this.leftLink > 0;
    };

    NetworkNode.prototype.hasRight = function () {
        return this.rightLink > 0;
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

    Network.prototype.getNeighbor = function (number) {
        return this.findOneByProperty("number", number);
    };

    Network.prototype.findPath = function (parent) {
        var start = (function (network) {
            var records = network.findAllByProperty("parent", parent);
            return records.sort(function (a, b) {
                return a.number > b.number;
            })[0];
        })(this);

        if (!start) {
            alert("Incorrect node number");
        }

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
        $(".output").innerHTML = network.findPath($("#start-node").value);
    });
};


