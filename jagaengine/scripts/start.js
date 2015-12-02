/**
 * Created by slesh on 11/30/15.
 */

"use strict";

window.onload = JagaEngine.start;
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();