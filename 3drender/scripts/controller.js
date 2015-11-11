/**
 * Created by slesh on 10/24/15.
 */
"use strict";

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
        case RenderType.OBLIQUE:
            renderState += "<hr>" +
                          "OBLIQUE</br>L..................." + this.render.settings.oblique.l.toFixed(1) +
                       "</br>&ang;&alpha;.................." + this.render.settings.oblique.alpha + "&deg;"
            break;
        case RenderType.PERSPECTIVE:
            renderState += "<hr>" +
                "PERSPECTIVE</br>Window View Top...." + this.render.settings.perspective.windowView.top +
                           "</br>Window View Left..." + this.render.settings.perspective.windowView.left +
                           "</br>Window View Width.." + this.render.settings.perspective.windowView.width +
                           "</br>Window View Height." + this.render.settings.perspective.windowView.height +
                           "</br>&ang;Fov..............." + this.render.settings.perspective.fov + "&deg;" +
                           "</br>Aspect............." + this.render.settings.perspective.aspect.toFixed(1) +
                           "</br>Near Plane........." + this.render.settings.perspective.nearPlane +
                           "</br>Far Plane.........." + this.render.settings.perspective.farPlane +
                           "</br>Distance..........." + this.render.settings.perspective.distance;

            break;
        case RenderType.ORTHOGONAL:
        case RenderType.AXONOMETRIC:

            break;
    }

    this.statusPanel.innerHTML = renderState;
};

Controller.prototype.switchRender = function(index){
    this.render = this.renderers[index];
    console.log("switch render to " + index)
};

Controller.prototype.addListenerForKey = function (keyCode, hasShift, hasCtrl, action) {
    var id = "" + keyCode + hasShift + hasCtrl;
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
        var id = "" + event.keyCode + event.shiftKey + event.ctrlKey;
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
    self.addListenerForKey(87/*"w"*/, false, false, function () { self.render.settings.rotate.x =  5; });
    self.addListenerForKey(83/*"s"*/, false, false, function () { self.render.settings.rotate.x = -5; });
    self.addListenerForKey(68/*"d"*/, false, false, function () { self.render.settings.rotate.y =  5; });
    self.addListenerForKey(65/*"a"*/, false, false, function () { self.render.settings.rotate.y = -5; });
    self.addListenerForKey(69/*"e"*/, false, false, function () { self.render.settings.rotate.z =  5; });
    self.addListenerForKey(81/*"q"*/, false, false, function () { self.render.settings.rotate.z = -5; });

    /*
     scaling
     */
    self.addListenerForKey(87/*"w"*/, false, true, function () { self.render.settings.scale.x = 1.1; });
    self.addListenerForKey(83/*"s"*/, false, true, function () { self.render.settings.scale.x = 0.9; });
    self.addListenerForKey(68/*"d"*/, false, true, function () { self.render.settings.scale.y = 1.1; });
    self.addListenerForKey(65/*"a"*/, false, true, function () { self.render.settings.scale.y = 0.9; });
    self.addListenerForKey(69/*"e"*/, false, true, function () { self.render.settings.scale.z = 1.1; });
    self.addListenerForKey(81/*"q"*/, false, true, function () { self.render.settings.scale.z = 0.9; });
    self.addListenerForKey(88/*"x"*/, false, true, function () { self.render.settings.scale.w = 1.1; });
    self.addListenerForKey(90/*"z"*/, false, true, function () { self.render.settings.scale.w = 0.9; });

    /*
     translating
     */
    self.addListenerForKey(39/*arrow-right*/, false, false, function () { self.render.settings.translate.x =  10; });
    self.addListenerForKey(37/*arrow-left */, false, false, function () { self.render.settings.translate.x = -10; });
    self.addListenerForKey(38/*arrow-up   */, false, false, function () { self.render.settings.translate.y = -10; });
    self.addListenerForKey(40/*arrow-down */, false, false, function () { self.render.settings.translate.y =  10; });
    self.addListenerForKey(38/*arrow-up   */, true,  false, function () { self.render.settings.translate.z = -10; });
    self.addListenerForKey(40/*arrow-down */, true,  false, function () { self.render.settings.translate.z =  10; });

    /*
     changing geometry parameters
     */
    function updateGeometry(property, value){
        self.render.parameters[property] += value;
        self.render.settings.isUpdateGeometry = true;
    }

    self.addListenerForKey(73/*i*/, false, false, function () { updateGeometry("innerRadius",  5); });
    self.addListenerForKey(73/*i*/, true,  false, function () { updateGeometry("innerRadius", -5); });

    self.addListenerForKey(79/*o*/, false, false, function () { updateGeometry("outerRadius",  5); });
    self.addListenerForKey(79/*o*/, true,  false, function () { updateGeometry("outerRadius", -5); });

    self.addListenerForKey(72/*h*/, false, false, function () { updateGeometry("height",  5); });
    self.addListenerForKey(72/*h*/, true,  false, function () { updateGeometry("height", -5); });

    self.addListenerForKey(78/*n*/, false, false, function () { updateGeometry("majorNumber",  1); });
    self.addListenerForKey(78/*n*/, true,  false, function () { updateGeometry("majorNumber", -1); });

    [49/*1*/, 50/*2*/, 51/*3*/, 52/*4*/].forEach(function (code, index) {
        self.addListenerForKey(code, false, true, function () {
            self.switchRender(index);
        });
    });

    /*
    oblique projection parameters
     */
    self.addListenerForKey(76/*l*/, false, false, function () { self.render.settings.oblique.l +=  0.1; });
    self.addListenerForKey(76/*l*/, true,  false, function () { self.render.settings.oblique.l += -0.1; });
    self.addListenerForKey(80/*p*/, false, false, function () { self.render.settings.oblique.alpha +=  5; });
    self.addListenerForKey(80/*p*/, true,  false, function () { self.render.settings.oblique.alpha += -5; });

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

    self.addListenerForKey(84/*t*/, false, false, createSwitcher("fov", [60, 90, 120]));
    self.addListenerForKey(82/*r*/, false, false, createSwitcher("aspect", [1, 4 / 3, 16 / 9]));

    self.addListenerForKey(70/*f*/, false, false, function () { self.render.settings.perspective.nearPlane +=  5; });
    self.addListenerForKey(70/*f*/, true,  false, function () { self.render.settings.perspective.nearPlane += -5; });

    self.addListenerForKey(71/*g*/, false, false, function () { self.render.settings.perspective.farPlane +=  5; });
    self.addListenerForKey(71/*g*/, true,  false, function () { self.render.settings.perspective.farPlane += -5; });

    self.addListenerForKey(67/*c*/, false,  false, function () { self.render.settings.perspective.distance +=  1; });
    self.addListenerForKey(67/*c*/, true,   false, function () { self.render.settings.perspective.distance += -1; });

    self.addListenerForKey(39/*arrow-right*/, true, true, function () { self.render.settings.perspective.windowView.width  +=  10; });
    self.addListenerForKey(37/*arrow-left */, true, true, function () { self.render.settings.perspective.windowView.width  += -10; });
    self.addListenerForKey(38/*arrow-up   */, true, true, function () { self.render.settings.perspective.windowView.height += -10; });
    self.addListenerForKey(40/*arrow-down */, true, true, function () { self.render.settings.perspective.windowView.height +=  10; });

    self.addListenerForKey(39/*arrow-right*/, false, true, function () { self.render.settings.perspective.windowView.left +=  10; });
    self.addListenerForKey(37/*arrow-left */, false, true, function () { self.render.settings.perspective.windowView.left += -10; });
    self.addListenerForKey(38/*arrow-up   */, false, true, function () { self.render.settings.perspective.windowView.top  += -10; });
    self.addListenerForKey(40/*arrow-down */, false, true, function () { self.render.settings.perspective.windowView.top  +=  10; });
};