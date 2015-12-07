/**
 * Created by slesh on 12/8/15.
 */
"use strict";

var JagaEngine = Object.create(null);
JagaEngine.start = function (canvas) {
    var cfg = {
        translation: BABYLON.Vector3.Zero(),
        rotation: BABYLON.Vector3.Zero(),
        scale: new BABYLON.Vector3(1.0, 1.0, 1.0),
        axonometric: {phi: 0, theta: 0},
        oblique: {l: 0, alpha: 0},
        perspective: {fov: 30, aspect: 1, znear: 0.1, zfar: 10, distance: 1.0},
        light: new BABYLON.Vector3(0, 0, 0),
        camera: null,
        isupdate: true,
        params: {
            majorNumber: 15,
            height: 200,
            innerRadius: 50,
            outerRadius: 150,
            colors: {
                inner: new BABYLON.Color4(1.0, 0, 0, 1),
                outer: new BABYLON.Color4(0.0, 1.0, 0, 1),
                base: new BABYLON.Color4(0.0, 0, 1.0, 1)
            }
        }
    };

    function drawingLoop() {
        device.clear();
        if (cfg.isupdate) {
            model.meshing(cfg.params);
            cfg.isupdate = false;
        }
        device.render(cfg, model);
    }

    var device = new JagaEngine.Device(canvas);
    var camera = new JagaEngine.Camera();
    var model = new JagaEngine.Model();
    var controller = new JagaEngine.Controller(cfg, function () {
        requestAnimationFrame(drawingLoop);
    });

    cfg.camera = camera;
    cfg.camera.position.z = 10;
    controller.registerEvents();
};