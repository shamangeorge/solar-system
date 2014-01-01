function Sun(solarSystem, scene) {
    this.color = new THREE.Color('orange');
    this.sunRadius = solarSystem.sunRadius || 10;
    this.adjust = 100000;
    this.SunRadiusRatio = solarSystem.SunRadiusRatio;
    this.AU = solarSystem.AU;
    this.mass = 332.800;
    this.mesh = this.createMesh();
    var glowMat = THREEx.createAtmosphereMaterial();
    glowMat.uniforms.glowColor.value = this.color;
    var glow = new THREE.Mesh(this.mesh.geometry.clone(), glowMat);
    glow.scale.multiplyScalar(1.05);
    this.mesh.add(glow);

    var atmosphereMat = THREEx.createAtmosphereMaterial();
    atmosphereMat.side = THREE.BackSide;
    atmosphereMat.uniforms.coeficient.value = 0.5;
    atmosphereMat.uniforms.power.value = 4.0;
    atmosphereMat.uniforms.glowColor.value = this.color;
    var atmosphere = new THREE.Mesh(this.mesh.geometry.clone(), atmosphereMat);
    atmosphere.scale.multiplyScalar(1.05);
    this.mesh.add(atmosphere);
};

Sun.prototype.createMesh = function() {
    var mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    return mesh;
};
Sun.prototype.createGeometry = function() {
    var geometry = new THREE.SphereGeometry(this.sunRadius, 128, 128);
    return geometry;
};
Sun.prototype.createMaterial = function() {
    var texture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/sunmap.jpg');
    var material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.05,
    });
    return material;
};
Sun.prototype.updatePhysics = function() {
    this.mesh.rotation.y -= 1 / 100;
};
