function Uranus(solarSystem, scene) {
    this.sunRadius = solarSystem.sunRadius || 10;
    this.adjust = 100000;
    this.SunRadiusRatio = solarSystem.SunRadiusRatio;
    this.AU = solarSystem.AU;
    this.distanceFromSun = 19.19 * this.AU;
    this.orbit = this.addOrbit(this.distanceFromSun);
    this.mesh = this.createMesh();
    this.ring = this.createRing();
    this.ring.scale.multiplyScalar(1.2);
    this.mesh.add(this.ring);
    scene.add(this.orbit);
};

Uranus.prototype.createMesh = function() {
    var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    return mesh;
};

Uranus.prototype.createMaterial = function() {
    var texture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/uranusmap.jpg');
    var material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.05,
    });
    return material;
};

Uranus.prototype.createGeometry = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio * 4.01, 128, 128);
    return geometry;
};


Uranus.prototype.addOrbit = function(amplitude) {
    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 1
    });
    var ellipse = new THREE.EllipseCurve(0, 0, amplitude, amplitude, 0, 2.0 * Math.PI, false);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);
    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    ellipseGeometry.computeTangents();
    var line = new THREE.Line(ellipseGeometry, material);
    line.rotation.x = Math.PI / 2;
    return line;
};

Uranus.prototype.createRing = function() {
    // create destination canvas
    var canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 72;
    var contextResult = canvasResult.getContext('2d');

    // load earthcloudmap
    var imageMap = new Image();
    imageMap.addEventListener("load", function() {

        // create dataMap ImageData for earthcloudmap
        var canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        var contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        // load earthcloudmaptrans
        var imageTrans = new Image();
        imageTrans.addEventListener("load", function() {
            // create dataTrans ImageData for earthcloudmaptrans
            var canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            var contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            // merge dataMap + dataTrans into dataResult
            var dataResult = contextMap.createImageData(canvasResult.width, canvasResult.height);
            for (var y = 0, offset = 0; y < imageMap.height; y++) {
                for (var x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 2;
                }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0)
            material.map.needsUpdate = true;
        })
        imageTrans.src = THREEx.Planets.baseURL + 'images/uranusringtrans.gif';
    }, false);
    imageMap.src = THREEx.Planets.baseURL + 'images/uranusringcolour.jpg';

    var geometry = new THREEx.Planets._RingGeometry(this.sunRadius / this.SunRadiusRatio * 7.01, 0.75, 64);
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        // map      : THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL+'images/ash_uvgrid01.jpg'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.lookAt(new THREE.Vector3(0.5, -4, 1));
    return mesh;
};

Uranus.prototype.updatePhysics = function() {
    this.mesh.position.x = this.distanceFromSun * Math.sin(Date.now() / this.adjust / 100);
    this.mesh.rotation.y += 1 / 1000;
    this.ring.rotation.y -= 1 / 1000;
    //this.uranus.position.y = this.distanceFromSun * Math.sin(Date.now() / 10000);
    this.mesh.position.z = this.distanceFromSun * Math.cos(Date.now() / this.adjust / 100);
};
