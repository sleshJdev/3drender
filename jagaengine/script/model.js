/**
 * Created by slesh on 12/8/15.
 */
"use strict";

(function (JagaEngine) {
    var Model = (function () {
        function Model() {
        }

        Model.generateVertices = function (majorNumber, radius) {
            var shift = 2 * Math.PI / majorNumber;
            var vertex = BABYLON.Vector3.Zero();
            var vertices = [];
            for (var i = 0, angle = 0.0; i <= majorNumber; ++i, angle += shift) {
                vertex.x = radius * Math.cos(angle);
                vertex.z = radius * Math.sin(angle);
                vertices.push(vertex.normalize().scale(radius / 1000.0));//closure: last = first
            }
            vertices[vertices.length - 1] = vertices[0].clone();

            return vertices;
        };

        Model.buildFacet = function (a, b, c, color, type) {
            var facet = Object.create(null);
            facet.a = a;
            facet.b = b;
            facet.c = c;
            facet.color = color;
            facet.type = type;

            return facet;
        };

        Model.buildFacets = function (vertices, peak, colors, majorNumber) {
            var ipp = vertices[0]; /*previous inner point*/
            var opp = vertices[majorNumber + 1]; /*outer point previous*/
            var ipc = null; /*current inner point*/
            var opc = null; /*current outer point*/
            var facets = [];
            for (var i = 1/*skip first*/; i <= majorNumber; ++i) {
                ipc = vertices[i];
                opc = vertices[majorNumber + i + 1];
                facets.push(Model.buildFacet(opc, ipp, ipc, colors.base, 1));
                facets.push(Model.buildFacet(opc, opp, ipp, colors.base, 1));
                facets.push(Model.buildFacet(ipc, peak, ipp, colors.inner, 2));
                facets.push(Model.buildFacet(opp, peak, opc, colors.outer, 3));
                ipp = ipc;
                opp = opc;
            }

            return facets;
        };

        Model.prototype.meshing = function (parameters) {
            var innerVertices = Model.generateVertices(parameters.majorNumber, parameters.innerRadius);
            var outerVertices = Model.generateVertices(parameters.majorNumber, parameters.outerRadius);
            var peak = new BABYLON.Vector3(0, parameters.height, 0).normalize().scale(parameters.height / 1000.0);
            this.vertices = innerVertices.concat(outerVertices);
            this.vertices.push(peak);
            this.facets = Model.buildFacets(this.vertices, peak, parameters.colors, parameters.majorNumber);

            return this;
        };

        return Model;
    })();
    JagaEngine.Model = Model;
})(JagaEngine || (JagaEngine = Object.create(null)));