/**
 * Created by slesh on 11/30/15.
 */

"use strict";

(function (JagaEngine) {
    var Controller = (function () {
        function Controller(model, camera, perspective) {
            this.events = Object.create(null);
            this.model = model;
            this.camera = camera;
            this.perspective = perspective
        }

        Controller.prototype.addListenerForKey = function (keyCode, hasShift, hasCtrl, hasAlt, action) {
            var id = "" + keyCode + hasShift + hasCtrl + hasAlt;
            var event = Object.create(null);
            event.isDown = false;
            event.keyCode = keyCode;
            event.hasShift = hasShift || false;
            event.hasCtrl = hasCtrl || false;
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
                            if (ctrl || shift) {
                                registeredEvent.action(event);
                            }
                        }
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
            self.addListenerForKey(87/*"w"*/, false, false, false, function () { self.model.rotation.x +=  5; });
            self.addListenerForKey(83/*"s"*/, false, false, false, function () { self.model.rotation.x += -5; });
            self.addListenerForKey(68/*"d"*/, false, false, false, function () { self.model.rotation.y +=  5; });
            self.addListenerForKey(65/*"a"*/, false, false, false, function () { self.model.rotation.y += -5; });
            self.addListenerForKey(69/*"e"*/, false, false, false, function () { self.model.rotation.z +=  5; });
            self.addListenerForKey(81/*"q"*/, false, false, false, function () { self.model.rotation.z += -5; });

            /*
             scaling
             */
            self.addListenerForKey(87/*"w"*/, false, true, false, function () { self.model.scale.x += 1.1; });
            self.addListenerForKey(83/*"s"*/, false, true, false, function () { self.model.scale.x += 0.9; });
            self.addListenerForKey(68/*"d"*/, false, true, false, function () { self.model.scale.y += 1.1; });
            self.addListenerForKey(65/*"a"*/, false, true, false, function () { self.model.scale.y += 0.9; });
            self.addListenerForKey(69/*"e"*/, false, true, false, function () { self.model.scale.z += 1.1; });
            self.addListenerForKey(81/*"q"*/, false, true, false, function () { self.model.scale.z += 0.9; });
            self.addListenerForKey(88/*"x"*/, false, true, false, function () { self.model.scale.w += 1.1; });
            self.addListenerForKey(90/*"z"*/, false, true, false, function () { self.model.scale.w += 0.9; });

            /*
             translating
             */
            var translatingDelta = 0.1;
            self.addListenerForKey(39/*arrow-right*/, false, false, false, function () { self.model.translation.x += -translatingDelta; });
            self.addListenerForKey(37/*arrow-left */, false, false, false, function () { self.model.translation.x +=  translatingDelta; });
            self.addListenerForKey(38/*arrow-up   */, false, false, false, function () { self.model.translation.y += -translatingDelta; });
            self.addListenerForKey(40/*arrow-down */, false, false, false, function () { self.model.translation.y +=  translatingDelta; });
            self.addListenerForKey(38/*arrow-up   */, true,  false, false, function () { self.model.translation.z += -translatingDelta; });
            self.addListenerForKey(40/*arrow-down */, true,  false, false, function () { self.model.translation.z +=  translatingDelta; });

            /*
             changing geometry parameters
             */
            function updateGeometry(property, value) {
                self.model.parameters[property] += value;
                self.model.needUpdate = true;
            }

            self.addListenerForKey(73/*i*/, false, false, false, function () { updateGeometry("innerRadius",  5); });
            self.addListenerForKey(73/*i*/, true,  false, false, function () { updateGeometry("innerRadius", -5); });
            self.addListenerForKey(79/*o*/, false, false, false, function () { updateGeometry("outerRadius",  5); });
            self.addListenerForKey(79/*o*/, true,  false, false, function () { updateGeometry("outerRadius", -5); });
            self.addListenerForKey(72/*h*/, false, false, false, function () { updateGeometry("height",  5); });
            self.addListenerForKey(72/*h*/, true,  false, false, function () { updateGeometry("height", -5); });
            self.addListenerForKey(78/*n*/, false, false, false, function () { updateGeometry("majorNumber",  1); });
            self.addListenerForKey(78/*n*/, true,  false, false, function () { updateGeometry("majorNumber", -1); });

            [49/*1*/, 50/*2*/, 51/*3*/, 52/*4*/].forEach(function (code, index) {
                self.addListenerForKey(code, false, true, false, function () {
                    self.switchRender(index);
                });
            });

            /*
             oblique projection parameters
             */
            self.addListenerForKey(76/*l*/, false, false, false, function () { self.model.oblique.l +=  0.1; });
            self.addListenerForKey(76/*l*/, true,  false, false, function () { self.model.oblique.l += -0.1; });
            self.addListenerForKey(80/*p*/, false, false, false, function () { self.model.oblique.alpha +=  5; });
            self.addListenerForKey(80/*p*/, true,  false, false, function () { self.model.oblique.alpha += -5; });

            /*
             perspective projection
             */
            function createSwitcher(property, values) {
                var index = 0;
                return function /*switch*/() {
                    index = ++index % values.length;
                    self.perspective[property] = values[index];
                }
            }

            self.addListenerForKey(84/*t*/, false, false, false, createSwitcher("fov", [30, 60, 90, 120]));
            self.addListenerForKey(82/*r*/, false, false, false, createSwitcher("aspect", [1, 4 / 3, 16 / 9]));
            self.addListenerForKey(70/*f*/, false, false, false, function () { self.perspective.nearPlane +=  1; });
            self.addListenerForKey(70/*f*/, true,  false, false, function () { self.perspective.nearPlane += -1; });
            self.addListenerForKey(71/*g*/, false, false, false, function () { self.perspective.farPlane +=  1; });
            self.addListenerForKey(71/*g*/, true,  false, false, function () { self.perspective.farPlane += -1; });
            self.addListenerForKey(67/*c*/, false, false, false, function () { self.perspective.distance +=  1; });
            self.addListenerForKey(67/*c*/, true,  false, false, function () { self.perspective.distance += -1; });

            /*
             translating target
             */
            var targetOffset = 0.1;
            self.addListenerForKey(39/*arrow-right*/, false, true, false, function () { self.camera.target.x +=  targetOffset; });
            self.addListenerForKey(37/*arrow-left */, false, true, false, function () { self.camera.target.x += -targetOffset; });
            self.addListenerForKey(38/*arrow-up   */, false, true, false, function () { self.camera.target.y +=  targetOffset; });
            self.addListenerForKey(40/*arrow-down */, false, true, false, function () { self.camera.target.y += -targetOffset; });
            self.addListenerForKey(38/*arrow-up   */, true,  true, false, function () { self.camera.target.z += -targetOffset; });
            self.addListenerForKey(40/*arrow-down */, true,  true, false, function () { self.camera.target.z +=  targetOffset; });

            /*
             translating camera
             */
            var cameraOffset = 1;
            self.addListenerForKey(39/*arrow-right*/, false, false, true, function () { self.camera.position.x += -cameraOffset; });
            self.addListenerForKey(37/*arrow-left */, false, false, true, function () { self.camera.position.x +=  cameraOffset; });
            self.addListenerForKey(40/*arrow-down */, false, false, true, function () { self.camera.position.y +=  cameraOffset; });
            self.addListenerForKey(38/*arrow-up   */, false, false, true, function () { self.camera.position.y += -cameraOffset; });
            self.addListenerForKey(38/*arrow-up   */, true,  false, true, function () { self.camera.position.z += -cameraOffset; });
            self.addListenerForKey(40/*arrow-down */, true,  false, true, function () { self.camera.position.z +=  cameraOffset; });
        };

        return Controller;
    })();
    JagaEngine.Controller = Controller;
})(JagaEngine || (JagaEngine = Object.create(null)));