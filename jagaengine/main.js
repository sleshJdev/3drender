window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            callback();
        };
})();
window.onload = function () {
    var canvas = document.createElement("canvas");
    var status = document.createElement("div");
    canvas.width = 1000;//window.innerWidth;
    canvas.height = 640;//window.innerHeight;
    status.style.position = "absolute";
    status.style.top = "0";
    status.style.right = "0";
    status.style.width = "250px";
    status.style.height = "100%";
    status.style.borderLeft = "solid 1px dodgerblue";
    status.style.padding = "5px 10px 25px 25px";
    status.style.color = "dodgerblue";
    status.style.fontFamily = "monospace";
    status.style.fontSize = "1.05em";
    document.body.style.backgroundColor = "#000000";
    document.body.style.overflow = "hidden";
    document.body.appendChild(canvas);
    document.body.appendChild(status);
    JagaEngine.initialize();
    JagaEngine.addLoopListener(function (cfg) {
        var statusHtml =
            cfg.projection.name.toUpperCase() + "<hr>" +
            "TRANSLATE</br>&Delta;X................." + cfg.translation.x.toFixed(2) +
            "</br>&Delta;Y................." + cfg.translation.y.toFixed(2) +
            "</br>&Delta;Z................." + cfg.translation.z.toFixed(2) + "<hr>" +
            "ROTATE</br>&ang;X................." + cfg.rotationTotal.x + "&deg;" +
            "</br>&ang;Y................." + cfg.rotationTotal.y + "&deg;" +
            "</br>&ang;Z................." + cfg.rotationTotal.z + "&deg;<hr>" +
            "SCALE</br>X.................." + cfg.scale.x.toFixed(1) +
            "</br>Y.................." + cfg.scale.y.toFixed(1) +
            "</br>Z.................." + cfg.scale.z.toFixed(1) + "<hr>" +
            "GEOMENTRY</br>Points............." + cfg.params.majorNumber +
            "</br>Height............." + cfg.params.height +
            "</br>Inner Radius......." + cfg.params.innerRadius +
            "</br>Outer Radius......." + cfg.params.outerRadius + "<hr>" +
            "RENDER MODE</br>IS FILL............" + (cfg.isfill ? "TRUE" : "FALSE") +
            "</br>IS HIDE LINES......" + (cfg.ishidelines ? "TRUE" : "FALSE") + "<hr>" +
            "LIGHT</br>Light X...." + cfg.light.x.toFixed(2) +
            "</br>Light Y...." + cfg.light.y.toFixed(2) +
            "</br>Light Z...." + cfg.light.z.toFixed(2);
        switch (cfg.projection) {
            case JagaEngine.AXONOMETRIC:
                statusHtml += "<hr>" +
                    "AXONOMETRIC</br>&ang;&psi;................." + cfg.axonometric.psi + "&deg" +
                    "</br>&ang;&phi;................." + cfg.axonometric.phi + "&deg";
                break;
            case JagaEngine.OBLIQUE:
                statusHtml += "<hr>" +
                    "OBLIQUE</br>L..................." + cfg.oblique.l.toFixed(1) +
                    "</br>&ang;&alpha;.................." + cfg.oblique.alpha + "&deg;";
                break;
            case JagaEngine.PERSPECTIVE:
                statusHtml += "<hr>" +
                    "PERSPECTIVE</br>&ang;Fov..............." + cfg.perspective.fov + "&deg;" +
                    "</br>Aspect............." + cfg.perspective.aspect.toFixed(1) +
                    "</br>Near Plane........." + cfg.perspective.znear +
                    "</br>Far Plane.........." + cfg.perspective.zfar +
                    "</br>Distance..........." + cfg.perspective.distance.toFixed(2) +
                    "</br>Camera Position X.." + cfg.camera.position.x.toFixed(2) +
                    "</br>Camera Position Y.." + cfg.camera.position.y.toFixed(2) +
                    "</br>Camera Position Z.." + cfg.camera.position.z.toFixed(2) +
                    "</br>Camera Target X...." + cfg.camera.target.x.toFixed(2) +
                    "</br>Camera Target Y...." + cfg.camera.target.y.toFixed(2) +
                    "</br>Camera Target Z...." + cfg.camera.target.z.toFixed(2);
                break;
            case JagaEngine.ORTOGONAL_XY:
            case JagaEngine.ORTOGONAL_YZ:
            case JagaEngine.ORTOGONAL_XZ:
                break;
        }

        status.innerHTML = statusHtml;
    });
    JagaEngine.start(canvas);
};