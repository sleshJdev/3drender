/**
 * Created by slesh on 9/27/15.
 */

Util = Object.create(null);

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
}

Util.createSettings = function (translate) {
    var settings = Object.create(null);//settings to rendering of cone

    settings.rotate = new Vector(0, 0, 0);
    settings.scale = new Vector(1, 1, 1);
    settings.translate = translate || new Vector(0, 0, 0);
    settings.isUpdateGeometry = true;

    settings.perspective   = Object.create(null);
    settings.perspective.c = 1;

    return settings;
}
