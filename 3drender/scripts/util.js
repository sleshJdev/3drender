/**
 * Created by slesh on 9/27/15.
 */

"use strict";

(function (JagaEngine) {
    JagaEngine.Util = (function () {
        var Util = Object.create(null);
        Util.d2r = Math.PI / 180;
        Util.r2d = 180 / Math.PI;

        Util.createParameters = function (innerRadius, outerRadius, height, majorNumber) {
            var parameters = Object.create(null);//parameters for model
            parameters.innerRadius = innerRadius;
            parameters.outerRadius = outerRadius;
            parameters.height = height;
            parameters.majorNumber = majorNumber;
            parameters.colors = Object.create(null);
            parameters.colors.outer = new JagaEngine.Color(0, 0, 1, 1);
            parameters.colors.inner = new JagaEngine.Color(1, 0, 0, 1);
            parameters.colors.base = new JagaEngine.Color(0, 1, 0, 1);

            return parameters;
        };

        Util.createSettings = function (translate) {
            var settings = Object.create(null);//settings to rendering of cone

            settings.rotate         = new JagaEngine.Vector(0, 0, 0);
            settings.scale          = new JagaEngine.Vector(1, 1, 1);
            settings.translate      = translate || new JagaEngine.Vector(0, 0, 0);
            settings.isUpdateGeometry = true;

            settings.perspective = Object.create(null);
            settings.perspective.fov = 30;
            settings.perspective.aspect = 1;
            settings.perspective.nearPlane = 1;
            settings.perspective.farPlane = 5;

            settings.oblique = Object.create(null);
            settings.oblique.l = 2;
            settings.oblique.alpha = 45;

            return settings;
        };

        return Util;
    })();
})(JagaEngine);
