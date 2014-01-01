function Earth(solarSystem, scene) {
    this.sunRadius = solarSystem.sunRadius || 10;
    this.adjust = 100000;
    this.SunRadiusRatio = solarSystem.SunRadiusRatio;
    this.AU = solarSystem.AU;
    this.distanceFromSun = this.AU;
    this.orbit = this.addOrbit(this.distanceFromSun);
    this.mesh = this.createMesh();
    this.clouds = this.createEarthCloud();
    this.mesh.add(this.clouds);
    this.moon = this.createMoon();
    this.moon.position.set(0.2, 0.2, 0.2);
    this.mesh.add(this.moon);
    scene.add(this.orbit);
};


Earth.prototype.createMesh = function() {
    var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    return mesh;
};

Earth.prototype.createMaterial = function() {
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthbump1k.jpg'),
        bumpScale: 0.05,
        specularMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthspec1k.jpg'),
        specular: new THREE.Color('grey'),
    });
    return material;
};

Earth.prototype.createGeometry = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio, 128, 128);
    return geometry;
};

Earth.prototype.createEarthCloud = function() {
    // create destination canvas
    var canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 512;
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
            var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
            for (var y = 0, offset = 0; y < imageMap.height; y++) {
                for (var x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
                }
            }
            // update texture with result
            contextResult.putImageData(dataResult, 0, 0);
            material.map.needsUpdate = true;
        })
        imageTrans.src = THREEx.Planets.baseURL + 'images/earthcloudmaptrans.jpg';
    }, false);
    imageMap.src = THREEx.Planets.baseURL + 'images/earthcloudmap.jpg';

    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio + 0.001, 128, 128);
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
};


Earth.prototype.createMoon = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio / 4, 128, 128);
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/moonmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/moonbump1k.jpg'),
        bumpScale: 0.002,
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
};

Earth.prototype.addOrbit = function(amplitude) {
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


Earth.prototype.updatePhysics = function() {
    this.clouds.rotation.y -= 1 / 3000;
    this.mesh.rotation.y += 1 / 10000;
    this.mesh.position.x = this.distanceFromSun * Math.sin(Date.now() / this.adjust / 10);
    //this.mesh.position.y = this.AU * Math.sin(Date.now() / 10000);
    this.mesh.position.z = this.distanceFromSun * Math.cos(Date.now() / this.adjust / 10);
    this.moon.rotation.y += 1 / 1000;
    this.moon.position.x = 0.00256955529 * this.AU * Math.sin(Date.now() / 10000);
    this.moon.position.y = 0.00256955529 * this.AU * Math.sin(Date.now() / 10000);
    this.moon.position.z = 0.00256955529 * this.AU * Math.cos(Date.now() / 10000);
};
