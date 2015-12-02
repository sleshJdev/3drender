/**
 * Created by slesh on 11/30/15.
 */

"use strict";

(function (JagaEngine) {
    var Camera = (function () {
        function Camera() {
            this.position = Babylon.Vector3.Zero();
            this.target = Babylon.Vector3.Zero();
        }

        return Camera;
    })();
    JagaEngine.Camera = Camera;
})(JagaEngine || (JagaEngine = Object.create(null)));