/**
 * Created by slesh on 11/22/15.
 */
"use strict";

(function (JagaEngine) {
    JagaEngine.Mesh = (function () {
        function Mesh(startPosition, startRotation, startScale) {
            this.vertices = [];
            this.faces = [];
            this.position = startPosition;
            this.rotation = startRotation;
            this.scale = startScale;
        }

        Mesh.prototype.transformation = function () {
            var r = this.rotation.toRadians();
            var s = this.scale;
            var p = JagaEngine.Vector3.Copy(this.position).normalize();

            return JagaEngine.Matrix.RotationYawPitchRoll(r.y, r.x, r.z).multiply(JagaEngine.Matrix.Translation(p.x, p.y, p.z));
        };

        return Mesh;
    })();
})(JagaEngine || (JagaEngine = Object.create(null)));