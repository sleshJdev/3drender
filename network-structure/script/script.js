window.onload = function () {
    "use strict";

    function $(select) {
        return document.querySelector(select);
    }

    var headers = ["Number", "Id", "Parent", "Left Link", "Right Link"];
    var graph = new Graph();
    graph.addVertex(new Vertex(1, 11, 1, 2, 4));
    graph.addVertex(new Vertex(2, 111, 11, -1, -1));
    graph.addVertex(new Vertex(3, 12, 2, 5, 14));
    graph.addVertex(new Vertex(4, 12, 1, 5, 7));
    graph.addVertex(new Vertex(5, 121, 12, -1, 6));
    graph.addVertex(new Vertex(6, 122, 12, 8, -1));
    graph.addVertex(new Vertex(7, 13, 1, 12, -1));
    graph.addVertex(new Vertex(8, 1221, 122, -1, 9));
    graph.addVertex(new Vertex(9, 1222, 122, 10, -1));
    graph.addVertex(new Vertex(10, 1228, 1222, -1, 11));
    graph.addVertex(new Vertex(11, 1229, 1222, -1, -1));
    graph.addVertex(new Vertex(12, 1221, 13, -1, 13));
    graph.addVertex(new Vertex(13, 1222, 13, 10, -1));
    graph.addVertex(new Vertex(14, 21, 2, 17, -1));
    graph.addVertex(new Vertex(15, 221, 21, 16, -1));
    graph.addVertex(new Vertex(16, 1222, 221, 10, -1));
    graph.addVertex(new Vertex(17, 13, 21, 12, 15));
    graph.fillTable(headers, $("table"));

    $("#search-button").addEventListener("click", function () {
        $(".output").innerHTML = graph.findPath($("#start-node").value);
    });

    $("#clear-button").addEventListener("click", function () {
        graph.clear($("#start-node").value);
        graph.fillTable(headers, $("table"));
    });

    $("#build-button").addEventListener("click", function () {
        graph.buildRelations($("#start-node").value);
        graph.fillTable(headers, $("table"));
    });

    $("#build-all-button").addEventListener("click", function () {
        graph.vertexes.forEach(function (vertex) {
            if (!vertex.rightLink && !vertex.leftLink) {
                graph.buildRelations(vertex.parent);
            }
        });
        graph.fillTable(headers, $("table"));
    });
};


