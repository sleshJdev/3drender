/**
 * Created by slesh on 12/4/15.
 */
"use strict";

(function (JagaEngine) {
    var Controller = (function () {
        function Controller(cfg, listener) {
            this.events = Object.create(null);
            this.cfg = cfg;
            this.listener = listener;
        }

        Controller.prototype.addListenerForKey = function (keyCode, hasShift, hasCtrl, hasAlt, action) {
            var id = "" + keyCode + hasShift + hasCtrl + hasAlt;
            var event = Object.create(null);
            event.isDown = false;
            event.keyCode = keyCode;
            event.hasShift = hasShift;
            event.hasCtrl = hasCtrl;
            event.hasAlt = hasAlt;
            event.action = action;
            this.events[id] = event;
        };

        Controller.prototype.registerEvents = function () {
            var self = this;

            function handler(event) {
                //console.log(event);
                var isDown = event.type == "keydown";
                var id = "" + event.keyCode + event.shiftKey + event.ctrlKey + event.altKey;
                if (id in self.events) {
                    self.events[id].isDown = isDown;
                    for (var key in self.events) {
                        var registeredEvent = self.events[key];
                        if (registeredEvent.isDown) {
                            var shift = event.shiftKey == registeredEvent.hasShift;
                            var ctrl = event.ctrlKey == registeredEvent.hasCtrl;
                            var alt = event.altKey == registeredEvent.hasAlt;
                            if (ctrl || shift || alt) {
                                registeredEvent.action(event);
                            }
                        }
                    }
                    if (isDown) {
                        self.listener(self.cfg);
                    }
                    event.preventDefault();
                    event.stopPropagation();
                }
            }

            document.addEventListener("keydown", handler);
            document.addEventListener("keyup", handler);

            /*
             rotating
             */
            self.addListenerForKey(87/*"w"*/, false, false, false, function () { self.cfg.rotation.x +=  5; });
            self.addListenerForKey(83/*"s"*/, false, false, false, function () { self.cfg.rotation.x += -5; });
            self.addListenerForKey(68/*"d"*/, false, false, false, function () { self.cfg.rotation.y +=  5; });
            self.addListenerForKey(65/*"a"*/, false, false, false, function () { self.cfg.rotation.y += -5; });
            self.addListenerForKey(69/*"e"*/, false, false, false, function () { self.cfg.rotation.z +=  5; });
            self.addListenerForKey(81/*"q"*/, false, false, false, function () { self.cfg.rotation.z += -5; });

            /*
             scaling
             */
            self.addListenerForKey(87/*"w"*/, false, true, false, function () { self.cfg.scale.x += -0.1; });
            self.addListenerForKey(83/*"s"*/, false, true, false, function () { self.cfg.scale.x +=  0.1; });
            self.addListenerForKey(68/*"d"*/, false, true, false, function () { self.cfg.scale.y += -0.1; });
            self.addListenerForKey(65/*"a"*/, false, true, false, function () { self.cfg.scale.y +=  0.1; });
            self.addListenerForKey(69/*"e"*/, false, true, false, function () { self.cfg.scale.z += -0.1; });
            self.addListenerForKey(81/*"q"*/, false, true, false, function () { self.cfg.scale.z +=  0.1; });

            /*
             translating
             */
            var translatingDelta = 0.01;
            self.addListenerForKey(39/*arrow-right*/, false, false, false, function () { self.cfg.translation.x +=  translatingDelta; });
            self.addListenerForKey(37/*arrow-left */, false, false, false, function () { self.cfg.translation.x += -translatingDelta; });
            self.addListenerForKey(38/*arrow-up   */, false, false, false, function () { self.cfg.translation.y +=  translatingDelta; });
            self.addListenerForKey(40/*arrow-down */, false, false, false, function () { self.cfg.translation.y += -translatingDelta; });
            self.addListenerForKey(38/*arrow-up   */, true,  false, false, function () { self.cfg.translation.z +=  translatingDelta; });
            self.addListenerForKey(40/*arrow-down */, true,  false, false, function () { self.cfg.translation.z += -translatingDelta; });

            /*
             changing geometry parameters
             */
            function updateGeometry(property, value) {
                self.cfg.params[property] += value;
                self.cfg.isupdate = true;
            }

            self.addListenerForKey(73/*i*/, false, false, false, function () { updateGeometry("innerRadius",  5); });
            self.addListenerForKey(73/*i*/, true,  false, false, function () { updateGeometry("innerRadius", -5); });
            self.addListenerForKey(79/*o*/, false, false, false, function () { updateGeometry("outerRadius",  5); });
            self.addListenerForKey(79/*o*/, true,  false, false, function () { updateGeometry("outerRadius", -5); });
            self.addListenerForKey(72/*h*/, false, false, false, function () { updateGeometry("height",  5); });
            self.addListenerForKey(72/*h*/, true,  false, false, function () { updateGeometry("height", -5); });
            self.addListenerForKey(78/*n*/, false, false, false, function () { updateGeometry("majorNumber",  1); });
            self.addListenerForKey(78/*n*/, true,  false, false, function () { updateGeometry("majorNumber", -1); });

            var projections = [JagaEngine.ORTOGONAL_XY, JagaEngine.ORTOGONAL_YZ, JagaEngine.ORTOGONAL_XZ,
                               JagaEngine.AXONOMETRIC,  JagaEngine.OBLIQUE,      JagaEngine.PERSPECTIVE];
            [49/*1*/, 50/*2*/, 51/*3*/, 52/*4*/, 53/*5*/, 54/*6*/].forEach(function (code, index) {
                self.addListenerForKey(code, false, true, false, function () {
                    self.cfg.projectionType = projections[index];
                });
            });

            /*
             axonometric projection parameters
             */
            var axonometricDelta = 5;
            self.addListenerForKey(77/*m*/, false, false, false, function () { self.cfg.axonometric.phi +=  axonometricDelta; });
            self.addListenerForKey(77/*m*/, true,  false, false, function () { self.cfg.axonometric.phi += -axonometricDelta; });
            self.addListenerForKey(75/*k*/, false, false, false, function () { self.cfg.axonometric.psi +=  axonometricDelta; });
            self.addListenerForKey(75/*k*/, true,  false, false, function () { self.cfg.axonometric.psi += -axonometricDelta; });

            /*
             oblique projection parameters
             */
            self.addListenerForKey(76/*l*/, false, false, false, function () { self.cfg.oblique.l +=  0.1; });
            self.addListenerForKey(76/*l*/, true,  false, false, function () { self.cfg.oblique.l += -0.1; });
            self.addListenerForKey(80/*p*/, false, false, false, function () { self.cfg.oblique.alpha +=  5; });
            self.addListenerForKey(80/*p*/, true,  false, false, function () { self.cfg.oblique.alpha += -5; });

            /*
             perspective projection
             */
            function createSwitcher(property, values) {
                var index = 0;
                return function /*switch*/() {
                    index = ++index % values.length;
                    self.cfg.perspective[property] = values[index];
                }
            }

            self.addListenerForKey(84/*t*/, false, false, false, createSwitcher("fov", [30, 60, 90, 120]));
            self.addListenerForKey(82/*r*/, false, false, false, createSwitcher("aspect", [1, 4 / 3, 16 / 9]));
            self.addListenerForKey(70/*f*/, false, false, false, function () { self.cfg.perspective.znear +=  1; });
            self.addListenerForKey(70/*f*/, true,  false, false, function () { self.cfg.perspective.znear += -1; });
            self.addListenerForKey(71/*g*/, false, false, false, function () { self.cfg.perspective.zfar +=  1; });
            self.addListenerForKey(71/*g*/, true,  false, false, function () { self.cfg.perspective.zfar += -1; });
            self.addListenerForKey(67/*c*/, false, false, false, function () { self.cfg.perspective.distance +=  0.1; });
            self.addListenerForKey(67/*c*/, true,  false, false, function () { self.cfg.perspective.distance += -0.1; });

            /*
             translating target
             */
            var targetOffset = 0.05;
            //self.addListenerForKey(39/*arrow-right*/, false, true, false, function () { self.cfg.camera.target.x +=  targetOffset; });
            //self.addListenerForKey(37/*arrow-left */, false, true, false, function () { self.cfg.camera.target.x += -targetOffset; });
            //self.addListenerForKey(38/*arrow-up   */, false, true, false, function () { self.cfg.camera.target.y +=  targetOffset; });
            //self.addListenerForKey(40/*arrow-down */, false, true, false, function () { self.cfg.camera.target.y += -targetOffset; });
            //self.addListenerForKey(38/*arrow-up   */, true,  true, false, function () { self.cfg.camera.target.z += -targetOffset; });
            //self.addListenerForKey(40/*arrow-down */, true,  true, false, function () { self.cfg.camera.target.z +=  targetOffset; });

            /*
             translating camera
             */
            var cameraOffset = 0.1;
            self.addListenerForKey(39/*arrow-right*/, false, false, true, function () { self.cfg.camera.position.x +=  cameraOffset; });
            self.addListenerForKey(37/*arrow-left */, false, false, true, function () { self.cfg.camera.position.x += -cameraOffset; });
            self.addListenerForKey(38/*arrow-up   */, false, false, true, function () { self.cfg.camera.position.y +=  cameraOffset; });
            self.addListenerForKey(40/*arrow-down */, false, false, true, function () { self.cfg.camera.position.y += -cameraOffset; });
            self.addListenerForKey(38/*arrow-up   */, true,  false, true, function () { self.cfg.camera.position.z +=  cameraOffset; });
            self.addListenerForKey(40/*arrow-down */, true,  false, true, function () { self.cfg.camera.position.z += -cameraOffset; });

            var lightOffset = 0.01;
            self.addListenerForKey(39/*arrow-right*/, false, true, false, function () { self.cfg.light.x +=  lightOffset; });
            self.addListenerForKey(37/*arrow-left */, false, true, false, function () { self.cfg.light.x += -lightOffset; });
            self.addListenerForKey(40/*arrow-down */, false, true, false, function () { self.cfg.light.y +=  lightOffset; });
            self.addListenerForKey(38/*arrow-up   */, false, true, false, function () { self.cfg.light.y += -lightOffset; });
            self.addListenerForKey(38/*arrow-up   */, true,  true, false, function () { self.cfg.light.z +=  lightOffset; });
            self.addListenerForKey(40/*arrow-down */, true,  true, false, function () { self.cfg.light.z += -lightOffset; });
        };

        return Controller;
    })();
    JagaEngine.Controller = Controller;
})(JagaEngine || (JagaEngine = Object.create(null)));