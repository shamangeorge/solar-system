function Jupiter(solarSystem, scene) {
    this.sunRadius = solarSystem.sunRadius || 10;
    this.adjust = 100000;
    this.SunRadiusRatio = solarSystem.SunRadiusRatio;
    this.AU = solarSystem.AU;
    this.distanceFromSun = 5.203 * this.AU;
    this.orbit = this.addOrbit(this.distanceFromSun);
    this.mesh = this.createMesh();
    scene.add(this.orbit);
};

Jupiter.prototype.createMesh = function() {
    var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    return mesh;
};

Jupiter.prototype.createMaterial = function() {
    var texture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/jupitermap.jpg');
    var material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.02,
    });
    return material;
};

Jupiter.prototype.createGeometry = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio * 11.19, 128, 128);
    return geometry;
};


Jupiter.prototype.addOrbit = function(amplitude) {
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

Jupiter.prototype.updatePhysics = function() {
    this.mesh.position.x = this.distanceFromSun * Math.sin(Date.now() / this.adjust / 100);
    this.mesh.rotation.y += 1 / 1000;
    //this.mesh.position.y = this.distanceFromSun * Math.sin(Date.now() / 10000);
    this.mesh.position.z = this.distanceFromSun * Math.cos(Date.now() / this.adjust / 100);
};
