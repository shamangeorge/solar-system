function Mercury(solarSystem, scene) {
    this.system = solarSystem;
    this.sunRadius = solarSystem.sunRadius || 10;
    this.adjust = 10;
    this.SunRadiusRatio = solarSystem.SunRadiusRatio;
    this.AU = solarSystem.AU;
    this.mass = 0.055;
    //standard gravitational paramater for mercury
    this.mew = Math.pow(this.system.G, 2);
    this.distanceFromSun = 0.387 * this.AU;
    this.minDistanceFromSun = 0.307 * this.AU;
    this.maxDistanceFromSun = 0.467 * this.AU;
    this.eccentricity = (this.maxDistanceFromSun - this.minDistanceFromSun) / (this.maxDistanceFromSun + this.minDistanceFromSun);
    this.semiMajorAxis = 2 * (this.minDistanceFromSun + this.maxDistanceFromSun) / 2;
    this.semiMinorAxis = Math.sqrt(this.maxDistanceFromSun * this.minDistanceFromSun);
    this.period = 2 * Math.PI * Math.sqrt(Math.pow(this.semiMajorAxis, 3) / this.mew);
    this.orbit = this.addOrbit(this.distanceFromSun);
    this.mesh = this.createMesh();
    this.orbitalVelocity = Math.sqrt(this.mew * (2 / this.distanceFromSun - 1 / this.semiMajorAxis)) / this.adjust;
    console.log(this.orbitalVelocity);
    scene.add(this.orbit);
};

Mercury.prototype.createMesh = function() {
    var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    return mesh;
};

Mercury.prototype.createMaterial = function() {
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/mercurymap.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/mercurybump.jpg'),
        bumpScale: 0.005,
    });
    return material;
};

Mercury.prototype.createGeometry = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius / this.SunRadiusRatio * 0.382, 128, 128);
    return geometry;
};


Mercury.prototype.addOrbit = function(amplitude) {
    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 1
    });
    var fociiDistance = Math.sqrt(Math.pow(this.semiMajorAxis, 2) - Math.pow(this.semiMinorAxis, 2));
    this.system.sun.mesh.position.x = -fociiDistance / 2;
    var ellipse = new THREE.EllipseCurve(0, 0, this.semiMajorAxis, this.semiMinorAxis, 0, 2.0 * Math.PI, false);
    var ellipsePath = new THREE.CurvePath();
    ellipsePath.add(ellipse);
    var ellipseGeometry = ellipsePath.createPointsGeometry(100);
    ellipseGeometry.computeTangents();
    var line = new THREE.Line(ellipseGeometry, material);
    line.rotation.x = Math.PI / 2;
    return line;
};

Mercury.prototype.updatePhysics = function() {
    this.mesh.position.x = this.semiMajorAxis * Math.cos(this.orbitalVelocity * Date.now() / this.adjust);
    this.mesh.rotation.y += 1 / 1000;
    //this.mesh.position.y = 0.387 * this.AU * Math.sin(Date.now() / 10000);
    this.mesh.position.z = this.semiMinorAxis * Math.sin(this.orbitalVelocity * Date.now() / this.adjust);
};
