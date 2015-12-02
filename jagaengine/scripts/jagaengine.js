/**
 * Created by slesh on 11/29/15.
 */

"use strict";

var JagaEngine = Object.create(null);
(function (JagaEngine) {
    JagaEngine.CONSTS = Object.create(null);
    JagaEngine.CONSTS.D2R = Math.PI / 180;
    JagaEngine.CONSTS.R2D = 180 / Math.PI;

    JagaEngine.start = function (configuration) {
        this.workingWidth = 1200;
        this.workingHeight = 600;

        var canvas = document.createElement("canvas");
        canvas.width = this.workingWidth;
        canvas.height = this.workingHeight;
        canvas.style.backgroundColor = "#000000";
        document.body.appendChild(canvas);

        var parameters = Object.create(null);//parameters for model
        parameters.innerRadius = 300;
        parameters.outerRadius = 600;
        parameters.height = 1000;
        parameters.majorNumber = 5;
        parameters.colors = Object.create(null);
        parameters.colors.outer = new Babylon.Color4(0, 0, 1, 1);
        parameters.colors.inner = new Babylon.Color4(1, 0, 0, 1);
        parameters.colors.base = new Babylon.Color4(0, 1, 0, 1);

        var perspective = Object.create(null);
        perspective.fov = 30;
        perspective.aspect = 1;
        perspective.nearPlane = 0.01;
        perspective.farPlane = 1;
        var model = new JagaEngine.Model(parameters).meshing();
        var camera = new JagaEngine.Camera();
        camera.position = new Babylon.Vector3(0.0, 0.0, 10);
        var controller = new JagaEngine.Controller(model, camera, perspective);
        controller.registerEvents();
        var device = new JagaEngine.Device(canvas);

        function loop() {
            if(model.needUpdate){
                model.meshing();
                model.needUpdate = false;
            }
            device.clear();
            device.render(model, camera, perspective);
            device.present();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    };
})(JagaEngine || (JagaEngine = Object.create(null)));


