/**
 * Created by slesh on 11/30/15.
 */
"use strict";

(function (JagaEngine) {
    var ModuleResolver = (function () {
        function ModuleResolver() {
            this.cache = Object.create(null);
            this.exports = Object.create(null);
        }

        ModuleResolver.prototype.get = function (name, successCallback) {
            var self = this;
            if (name in self.cache) {
                return self.cache[name];
            }
            var http = new XMLHttpRequest();
            http.open("get", name, true);
            http.addEventListener("load", function (event) {
                if (event.target.readyState == 4 && event.target.status == 200) {
                    new Function("exports", event.target.responseText)(self.exports);
                    self.cache[name] = self.exports.module;
                    successCallback(self.exports.module);
                    console.log("module " + name + " loading ... done!");
                } else {
                    console.log("load of module " + name + " ... failed");
                }
            });
            http.send(null);
        };

        return ModuleResolver;
    })();
    JagaEngine.ModuleResolver = ModuleResolver;
})(JagaEngine || (JagaEngine = Object.create(null)));

//var exports = Object.create(null);
//var moduleResolver = new ModuleResolver();
//moduleResolver.get("modules/camera.js", function (module) {
//    console.log("module: " + module);
//    JagaEngine.Camera = module;
//});