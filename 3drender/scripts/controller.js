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

Controller.prototype.showStatus = function () {
    this.statusPanel.innerHTML = this.render.getStatus();
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
                    if (event.shiftKey && registeredEvent.hasShift) {
                        registeredEvent.action(event);
                    } else if (event.ctrlKey && registeredEvent.hasCtrl) {
                        registeredEvent.action(event);
                    } else if (event.ctrlKey  == registeredEvent.hasCtrl &&
                               event.shiftKey == registeredEvent.hasShift) {
                        registeredEvent.action(event);
                    }
                }
            }
            if (isDown) {
                self.render.rendering();
                self.showStatus();
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
    self.addListenerForKey(87/*"w"*/, false, false, function () { self.render.settings.rotate.x =  10; });
    self.addListenerForKey(83/*"s"*/, false, false, function () { self.render.settings.rotate.x = -10; });
    self.addListenerForKey(68/*"d"*/, false, false, function () { self.render.settings.rotate.y =  10; });
    self.addListenerForKey(65/*"a"*/, false, false, function () { self.render.settings.rotate.y = -10; });
    self.addListenerForKey(69/*"e"*/, false, false, function () { self.render.settings.rotate.z =  10; });
    self.addListenerForKey(81/*"q"*/, false, false, function () { self.render.settings.rotate.z = -10; });

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

    self.addListenerForKey(67/*c*/, false, false, function () { self.render.settings.perspective.c +=  0.5; });
    self.addListenerForKey(67/*c*/, true,  false, function () { self.render.settings.perspective.c += -0.5; });
};