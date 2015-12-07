// shim layer with setTimeout fallback
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
document.addEventListener("DOMContentLoaded", init, false);
function init() {
    var canvas = document.createElement("canvas");
    var size = 0.7 * Math.max(window.innerWidth, window.innerWidth);
    canvas.width = size;
    canvas.height = size;
    document.body.appendChild(canvas);
    JagaEngine.start(canvas);
}
