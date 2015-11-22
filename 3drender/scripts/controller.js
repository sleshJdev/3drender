/**
 * Created by slesh on 10/24/15.
 */
"use strict";

(function (JagaEngine) {
    JagaEngine.Controller = (function () {
        function Controller(renderers, statusPanel){
            this.events = Object.create(null);
            this.renderers = renderers;
            this.render = renderers[0];
            this.statusPanel = statusPanel;
        }

        Controller.prototype.displayStatus = function () {
            var renderState =
                "TRANSLATE</br>&Delta;X................." + this.render.state.translate.x +
                "</br>&Delta;Y................." + this.render.state.translate.y +
                "</br>&Delta;Z................." + this.render.state.translate.z + "<hr>" +
                "ROTATE</br>&ang;X................." + this.render.state.rotate.x + "&deg;" +
                "</br>&ang;Y................." + this.render.state.rotate.y + "&deg;" +
                "</br>&ang;Z................." + this.render.state.rotate.z + "&deg;<hr>" +
                "SCALE</br>X.................." + this.render.state.scale.x.toFixed(1) +
                "</br>Y.................." + this.render.state.scale.y.toFixed(1) +
                "</br>Z.................." + this.render.state.scale.z.toFixed(1) + "<hr>" +
                "GEOMENTRY</br>Points............." + this.render.parameters.majorNumber +
                "</br>Height............." + this.render.parameters.height +
                "</br>Inner Radius......." + this.render .parameters.innerRadius +
                "</br>Outer Radius......." + this.render.parameters.outerRadius;
            switch (this.render.type){
                case JagaEngine.RenderType.OBLIQUE:
                    renderState += "<hr>" +
                        "OBLIQUE</br>L..................." + this.render.settings.oblique.l.toFixed(1) +
                        "</br>&ang;&alpha;.................." + this.render.settings.oblique.alpha + "&deg;"
                    break;
                case JagaEngine.RenderType.PERSPECTIVE:
                    renderState += "<hr>" +
                        "PERSPECTIVE</br>&ang;Fov..............." + this.render.settings.perspective.fov + "&deg;" +
                        "</br>Aspect............." + this.render.settings.perspective.aspect.toFixed(1) +
                        "</br>Near Plane........." + this.render.settings.perspective.nearPlane +
                        "</br>Far Plane.........." + this.render.settings.perspective.farPlane;

                    break;
                case JagaEngine.RenderType.ORTHOGONAL:
                case JagaEngine.RenderType.AXONOMETRIC:

                    break;
            }

            this.statusPanel.innerHTML = renderState;
        };

        Controller.prototype.switchRender = function(index){
            this.render = this.renderers[index];
            console.log("switch render to " + index)
        };

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

            function handler(event){
                //console.log(event);
                var isDown = event.type == "keydown";
                var id = "" + event.keyCode + event.shiftKey + event.ctrlKey + event.altKey;
                if (id in self.events) {
                    self.events[id].isDown = isDown;
                    for (var key in self.events) {
                        var registeredEvent = self.events[key];
                        if (registeredEvent.isDown) {
                            var shift = event.shiftKey == registeredEvent.hasShift;
                            var ctrl  = event.ctrlKey == registeredEvent.hasCtrl;
                            if (ctrl || shift) {
                                registeredEvent.action(event);
                            }
                        }
                    }
                    if (isDown) {
                        self.render.rendering();
                        self.displayStatus();
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
            self.addListenerForKey(87/*"w"*/, false, false, false, function () { self.render.settings.rotate.x = -5; });
            self.addListenerForKey(83/*"s"*/, false, false, false, function () { self.render.settings.rotate.x =  5; });
            self.addListenerForKey(68/*"d"*/, false, false, false, function () { self.render.settings.rotate.y =  5; });
            self.addListenerForKey(65/*"a"*/, false, false, false, function () { self.render.settings.rotate.y = -5; });
            self.addListenerForKey(69/*"e"*/, false, false, false, function () { self.render.settings.rotate.z =  5; });
            self.addListenerForKey(81/*"q"*/, false, false, false, function () { self.render.settings.rotate.z = -5; });

            /*
             scaling
             */
            self.addListenerForKey(87/*"w"*/, false, true, false, function () { self.render.settings.scale.x = 1.1; });
            self.addListenerForKey(83/*"s"*/, false, true, false, function () { self.render.settings.scale.x = 0.9; });
            self.addListenerForKey(68/*"d"*/, false, true, false, function () { self.render.settings.scale.y = 1.1; });
            self.addListenerForKey(65/*"a"*/, false, true, false, function () { self.render.settings.scale.y = 0.9; });
            self.addListenerForKey(69/*"e"*/, false, true, false, function () { self.render.settings.scale.z = 1.1; });
            self.addListenerForKey(81/*"q"*/, false, true, false, function () { self.render.settings.scale.z = 0.9; });
            self.addListenerForKey(88/*"x"*/, false, true, false, function () { self.render.settings.scale.w = 1.1; });
            self.addListenerForKey(90/*"z"*/, false, true, false, function () { self.render.settings.scale.w = 0.9; });

            /*
             translating
             */
            self.addListenerForKey(39/*arrow-right*/, false, false, false, function () { self.render.settings.translate.x =  10; });
            self.addListenerForKey(37/*arrow-left */, false, false, false, function () { self.render.settings.translate.x = -10; });
            self.addListenerForKey(38/*arrow-up   */, false, false, false, function () { self.render.settings.translate.y = -10; });
            self.addListenerForKey(40/*arrow-down */, false, false, false, function () { self.render.settings.translate.y =  10; });
            self.addListenerForKey(38/*arrow-up   */, true,  false, false, function () { self.render.settings.translate.z = -10; });
            self.addListenerForKey(40/*arrow-down */, true,  false, false, function () { self.render.settings.translate.z =  10; });

            /*
             changing geometry parameters
             */
            function updateGeometry(property, value){
                self.render.parameters[property] += value;
                self.render.settings.isUpdateGeometry = true;
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
            self.addListenerForKey(76/*l*/, false, false, false, function () { self.render.settings.oblique.l +=  0.1; });
            self.addListenerForKey(76/*l*/, true,  false, false, function () { self.render.settings.oblique.l += -0.1; });
            self.addListenerForKey(80/*p*/, false, false, false, function () { self.render.settings.oblique.alpha +=  5; });
            self.addListenerForKey(80/*p*/, true,  false, false, function () { self.render.settings.oblique.alpha += -5; });

            /*
             perspective projection
             */
            function createSwitcher(property, values){
                var index = 0;
                return function /*switch*/() {
                    index = ++index % values.length;
                    self.render.settings.perspective[property] = values[index];
                }
            }

            self.addListenerForKey(84/*t*/, false, false, false, createSwitcher("fov", [30, 60, 90, 120]));
            self.addListenerForKey(82/*r*/, false, false, false, createSwitcher("aspect", [1, 4 / 3, 16 / 9]));

            self.addListenerForKey(70/*f*/, false, false, false, function () { self.render.settings.perspective.nearPlane +=  5; });
            self.addListenerForKey(70/*f*/, true,  false, false, function () { self.render.settings.perspective.nearPlane += -5; });

            self.addListenerForKey(71/*g*/, false, false, false, function () { self.render.settings.perspective.farPlane +=  5; });
            self.addListenerForKey(71/*g*/, true,  false, false, function () { self.render.settings.perspective.farPlane += -5; });

            self.addListenerForKey(67/*c*/, false,  false, false, function () { self.render.settings.perspective.distance +=  1; });
            self.addListenerForKey(67/*c*/, true,   false, false, function () { self.render.settings.perspective.distance += -1; });
        };

        return Controller;
    })();
})(JagaEngine);