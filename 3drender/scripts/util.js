/**
 * Created by slesh on 9/27/15.
 */

"use strict";

(function (JagaEngine) {
    JagaEngine.Util = (function () {
        var Util = Object.create(null);

        Util.createParameters = function (innerRadius, outerRadius, height, majorNumber, colors) {
            var parameters = Object.create(null);//parameters for model
            parameters.innerRadius = innerRadius;
            parameters.outerRadius = outerRadius;
            parameters.height = height;
            parameters.majorNumber = majorNumber;
            if (!!colors) {
                parameters.colors = colors;
            } else {
                parameters.colors = Object.create(null);
                parameters.colors.outer = "blue";
                parameters.colors.inner = "red";
                parameters.colors.base = "green";
            }

            return parameters;
        };

        Util.createSettings = function (translate) {
            var settings = Object.create(null);//settings to rendering of cone

            settings.rotate         = new JagaEngine.Vector(0, 0, 0);
            settings.scale          = new JagaEngine.Vector(1, 1, 1);
            settings.translate      = translate || new JagaEngine.Vector(0, 0, 0);
            settings.isUpdateGeometry = true;

            settings.perspective = Object.create(null);
            settings.perspective.fov = 60;
            settings.perspective.aspect = 1;
            settings.perspective.nearPlane = 10;
            settings.perspective.farPlane = 100;
            settings.perspective.distance = 1;
            settings.perspective.viewWindow = Object.create(null);
            settings.perspective.viewWindow.top = 50;
            settings.perspective.viewWindow.left = 100;
            settings.perspective.viewWindow.width = 750;
            settings.perspective.viewWindow.height = 550;

            settings.oblique = Object.create(null);
            settings.oblique.l = 2;
            settings.oblique.alpha = 45;

            return settings;
        };

        return Util;
    })();
})(JagaEngine);
