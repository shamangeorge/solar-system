function Venus(solarSystem, scene) {
    this.sunRadius = solarSystem.sunRadius || 10;
    this.adjust = 100000;
    this.SunRadiusRatio = solarSystem.SunRadiusRatio;
    this.AU = solarSystem.AU;
    this.distanceFromSun = 0.723 * this.AU;
    this.minDistanceFromSun = 0.718 * this.AU;
    this.maxDistanceFromSun = 0.728 * this.AU;
    this.orbit = this.addOrbit(this.distanceFromSun);
    this.mesh = this.createMesh();
    scene.add(this.orbit);
};


Venus.prototype.createMesh = function() {
    var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    return mesh;
};

Venus.prototype.createMaterial = function() {
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/venusmap.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/venusbump.jpg'),
        bumpScale: 0.005,
    });
    return material;
};

Venus.prototype.createGeometry = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio * 0.8150, 128, 128)
    return geometry;
};

Venus.prototype.addOrbit = function(amplitude) {
    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 1
    });
    this.semiMajorAxis = (this.minDistanceFromSun + this.maxDistanceFromSun) / 2;
    this.semiMinorAxis = Math.sqrt(this.maxDistanceFromSun * this.minDistanceFromSun);
    var fociiDistance = Math.sqrt(Math.pow(this.semiMajorAxis, 2) - Math.pow(this.semiMinorAxis, 2));
    var ellipse = new THREE.EllipseCurve(0, 0, this.semiMajorAxis, this.semiMinorAxis, 0, 2.0 * Math.PI, false);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);
    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    ellipseGeometry.computeTangents();
    var line = new THREE.Line(ellipseGeometry, material);
    line.rotation.x = Math.PI / 2;
    return line;
};


Venus.prototype.updatePhysics = function() {
    this.mesh.position.x = this.semiMajorAxis * Math.sin(Date.now() / this.adjust);
    this.mesh.rotation.y += 1 / 1000;
    //this.mesh.position.y = this.distanceFromSun * Math.sin(Date.now() / 10000);
    this.mesh.position.z = this.semiMinorAxis * Math.cos(Date.now() / this.adjust);

};
