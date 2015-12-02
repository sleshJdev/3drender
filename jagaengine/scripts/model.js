/**
 * Created by slesh on 11/30/15.
 */

"use strict";

(function (JagaEngine) {
    var Model = (function () {
        function Model(parameters) {
            this.parameters = parameters;
            this.vertices = [];
            this.faces = [];
            this.scale = new Babylon.Vector3(1, 1, 1);
            this.rotation = Babylon.Vector3.Zero();
            this.translation = Babylon.Vector3.Zero();
            this.needUpdate = true;
        }

        Model.prototype.getWorldTransformation = function () {
            var s = Babylon.Matrix.Scaling(this.scale.x, this.scale.y, this.scale.z);
            var t = Babylon.Matrix.Translation(this.translation.x, this.translation.y, this.translation.z);
            var r = Babylon.Matrix.RotationYawPitchRoll(
                JagaEngine.CONSTS.D2R * this.rotation.y,
                JagaEngine.CONSTS.D2R * this.rotation.x,
                JagaEngine.CONSTS.D2R * this.rotation.z);
            var worldTransformation = r.multiply(s).multiply(t);

            return worldTransformation;
        };

        Model.prototype.meshing = function () {
            var mesh = this;
            mesh.vertices = [];
            mesh.faces = [];
            //create verices
            var peak = new Babylon.Vector3(0.0, -this.parameters.height, 0.0).normalize().scale(this.parameters.height / 1000.0);
            (function (params) {
                var shift = 2 * Math.PI / params.majorNumber;
                var vertex = Babylon.Vector3.Zero();
                var factors = [params.innerRadius / 1000.0, params.outerRadius / 1000.0];
                [params.innerRadius, params.outerRadius].forEach(function (radius, index) {
                    for (var i = 0, angle = 0.0; i <= params.majorNumber; ++i, angle += shift) {
                        vertex.x = Math.cos(angle) * radius;
                        vertex.z = Math.sin(angle) * radius;
                        mesh.vertices.push(vertex.normalize().scale(factors[index]));
                    }
                    mesh.vertices[mesh.vertices.length - 1] = mesh.vertices[mesh.vertices.length - params.majorNumber - 1];//closure: last = first
                });
            })(mesh.parameters);

            //create faces
            (function (params) {
                function buildFace(a, b, c, color, type) {
                    var face = Object.create(null);
                    face.a = a;
                    face.b = b;
                    face.c = c;
                    face.color = color;
                    face.type = type;

                    return face;
                }

                var ipp = mesh.vertices[0],//previous inner vertex
                    opp = mesh.vertices[params.majorNumber],//previous outer vertex
                    opc,//current outer vertex
                    ipc;//current inner vertex
                for (var i = 1/*skip first*/; i <= params.majorNumber + 1; ++i) {
                    ipc = mesh.vertices[i];
                    opc = mesh.vertices[i + params.majorNumber];
                    mesh.faces.push(buildFace(ipp, opp, opc, params.colors.base, 1));
                    mesh.faces.push(buildFace(ipp, opc, ipc, params.colors.base, 1));
                    mesh.faces.push(buildFace(ipp, ipc, peak, params.colors.inner, 2));
                    mesh.faces.push(buildFace(opp, opc, peak, params.colors.outer, 3));
                    ipp = ipc;
                    opp = opc;
                }
            })(mesh.parameters);
            mesh.vertices.push(peak);

            return mesh;
        };

        return Model;
    })();
    JagaEngine.Model = Model;
})(JagaEngine || (JagaEngine = Object.create(null)));