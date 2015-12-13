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
    canvas.height = 800;//window.innerHeight;
    canvas.style.backgroundColor = "#000000";
    status.style.position = "absolute";
    status.style.top = "0";
    status.style.right = "0";
    status.style.width = "250px";
    status.style.height = "100%";
    status.style.backgroundColor = "#000000";
    status.style.borderLeft = "solid 1px white";
    status.style.borderBottom = "solid 1px white";
    status.style.borderBottomLeftRadius = "50px";
    status.style.paddingLeft = "10px";
    status.style.color = "white";
    status.style.fontFamily = "DejaVu Sans Mono";
    status.style.fontSize = "small";
    document.body.style.backgroundColor = "#000000";
    document.body.appendChild(canvas);
    document.body.appendChild(status);
    JagaEngine.start(canvas);
    JagaEngine.addLoopListener(function (cfg) {
        var statusHtml =
            "</br>" + cfg.projectionType.name.toUpperCase() + "<hr>" +
            "</br>TRANSLATE</br>&Delta;X................." + cfg.translation.x.toFixed(2) +
            "</br>&Delta;Y................." + cfg.translation.y.toFixed(2) +
            "</br>&Delta;Z................." + cfg.translation.z.toFixed(2) + "<hr>" +
            "ROTATE</br>&ang;X................." + cfg.rotation.x + "&deg;" +
            "</br>&ang;Y................." + cfg.rotation.y + "&deg;" +
            "</br>&ang;Z................." + cfg.rotation.z + "&deg;<hr>" +
            "SCALE</br>X.................." + cfg.scale.x.toFixed(1) +
            "</br>Y.................." + cfg.scale.y.toFixed(1) +
            "</br>Z.................." + cfg.scale.z.toFixed(1) + "<hr>" +
            "GEOMENTRY</br>Points............." + cfg.params.majorNumber +
            "</br>Height............." + cfg.params.height +
            "</br>Inner Radius......." + cfg.params.innerRadius +
            "</br>Outer Radius......." + cfg.params.outerRadius + "<hr>" +
            "LIGHT</br>Light X...." + cfg.light.x.toFixed(2) +
            "</br>Light Y...." + cfg.light.y.toFixed(2) +
            "</br>Light Z...." + cfg.light.z.toFixed(2);
        switch (cfg.projectionType) {
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
                    "</br>Distance.........." + cfg.perspective.distance.toFixed(2) +
                    "</br>Camera Position X.." + cfg.camera.position.x.toFixed(2) +
                    "</br>Camera Position Y.." + cfg.camera.position.y.toFixed(2) +
                    "</br>Camera Position Z.." + cfg.camera.position.z.toFixed(2);
                break;
            case JagaEngine.ORTOGONAL_XY:
            case JagaEngine.ORTOGONAL_YZ:
            case JagaEngine.ORTOGONAL_XZ:
                break;
        }

        status.innerHTML = statusHtml;
    })
};