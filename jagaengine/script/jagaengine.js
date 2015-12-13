/**
 * Created by slesh on 12/8/15.
 */
"use strict";

var JagaEngine = Object.create(null);
JagaEngine.initialize = function () {
    JagaEngine.D2R = Math.PI / 180;
    JagaEngine.R2D = 180 / Math.PI;
    JagaEngine.ORTOGONAL_XY = {id: 1, name: "Cartographic XY"};
    JagaEngine.ORTOGONAL_YZ = {id: 2, name: "Cartographic YZ"};
    JagaEngine.ORTOGONAL_XZ = {id: 4, name: "Cartographic XZ"};
    JagaEngine.AXONOMETRIC = {id: 8, name: "Axonometric"};
    JagaEngine.OBLIQUE = {id: 16, name: "Oblique"};
    JagaEngine.PERSPECTIVE = {id: 32, name: "Perspective"};
    JagaEngine.Colors = Object.create(null);
    JagaEngine.Colors.BLACK = new JagaEngine.Color4(0, 0, 0, 1);
    JagaEngine.Colors.RED = new JagaEngine.Color4(1, 0, 0, 1);
    JagaEngine.Colors.GREEN = new JagaEngine.Color4(0, 1, 0, 1);
    JagaEngine.Colors.BLUE = new JagaEngine.Color4(0, 0, 1, 1);
    JagaEngine.Colors.WHITE = new JagaEngine.Color4(1, 1, 1, 1);
    JagaEngine.cfg = {
        projection: JagaEngine.PERSPECTIVE,
        translation: JagaEngine.Vector3.Zero(),
        rotation: JagaEngine.Vector3.Zero(),
        rotationTotal: JagaEngine.Vector3.Zero(),
        scale: new JagaEngine.Vector3(1.0, 1.0, 1.0),
        axonometric: {phi: 0, psi: 0},
        oblique: {l: 0, alpha: 0},
        perspective: {
            fov: 30,
            aspect: 1,
            znear: 0.1,
            zfar: 10,
            distance: 1.0
        },
        light: new JagaEngine.Vector3(-1, 0, 0),
        camera: null,
        ishidelines: true,
        isfill: false,
        isupdate: true,
        params: {
            majorNumber: 30,
            height: 200,
            innerRadius: 50,
            outerRadius: 150,
            colors: {
                inner: JagaEngine.Colors.RED,
                outer: JagaEngine.Colors.GREEN,
                base: JagaEngine.Colors.BLUE
            }
        },
        width: 0,
        height: 0
    };
    JagaEngine.loopListeners = [];

    JagaEngine.addLoopListener = function (listener) {
        JagaEngine.loopListeners.push(listener);
    };

    JagaEngine.start = function (canvas) {
        function drawingLoop() {
            device.clear();
            if (JagaEngine.cfg.isupdate) {
                model.meshing(JagaEngine.cfg.params);
                JagaEngine.cfg.isupdate = false;
            }
            device.render(JagaEngine.cfg, model);
        }

        var device = new JagaEngine.Device(canvas);
        var camera = new JagaEngine.Camera();
        var model = new JagaEngine.Model();
        var controller = new JagaEngine.Controller(JagaEngine.cfg, function (cfg) {
            requestAnimationFrame(drawingLoop);
            JagaEngine.loopListeners.forEach(function (listener) {
                listener(cfg);
            })
        });

        JagaEngine.cfg.width = canvas.width;
        JagaEngine.cfg.height = canvas.height;
        JagaEngine.cfg.camera = camera;
        JagaEngine.cfg.camera.position.z = -1;
        controller.registerEvents();
    };
};