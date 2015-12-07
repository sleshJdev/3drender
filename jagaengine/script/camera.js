/**
 * Created by slesh on 12/8/15.
 */
"use strict";

(function (JagaEngine) {
    var Camera = (function () {
        function Camera() {
            this.position = BABYLON.Vector3.Zero();
            this.target = BABYLON.Vector3.Zero();
        }

        return Camera;
    })();
    JagaEngine.Camera = Camera;
})(JagaEngine || (JagaEngine = Object.create(null)));