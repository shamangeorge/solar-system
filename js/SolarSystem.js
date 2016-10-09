var THREEx = THREEx || {}

THREEx.Planets = {}

THREEx.Planets.baseURL = './'

THREEx.Planets._RingGeometry = function(innerRadius, outerRadius, thetaSegments) {

    THREE.Geometry.call(this);

    innerRadius = innerRadius || 0;
    outerRadius = outerRadius || 50;
    thetaSegments = thetaSegments || 8;

    var normal = new THREE.Vector3(0, 0, 1);

    for (var i = 0; i < thetaSegments; i++) {
        var angleLo = (i / thetaSegments) * Math.PI * 2;
        var angleHi = ((i + 1) / thetaSegments) * Math.PI * 2;

        var vertex1 = new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0);
        var vertex2 = new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0);
        var vertex3 = new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0);
        var vertex4 = new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0);

        this.vertices.push(vertex1);
        this.vertices.push(vertex2);
        this.vertices.push(vertex3);
        this.vertices.push(vertex4);


        var vertexIdx = i * 4;

        // Create the first triangle
        var face = new THREE.Face3(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2, normal);
        var uvs = [];

        var uv = new THREE.Vector2(0, 0);
        uvs.push(uv);
        var uv = new THREE.Vector2(1, 0);
        uvs.push(uv);
        var uv = new THREE.Vector2(0, 1);
        uvs.push(uv);

        this.faces.push(face);
        this.faceVertexUvs[0].push(uvs);

        // Create the second triangle
        var face = new THREE.Face3(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3, normal);
        var uvs = [];

        var uv = new THREE.Vector2(0, 1);
        uvs.push(uv);
        var uv = new THREE.Vector2(1, 0);
        uvs.push(uv);
        var uv = new THREE.Vector2(1, 1);
        uvs.push(uv);

        this.faces.push(face);
        this.faceVertexUvs[0].push(uvs);
    }

    //this.computeCentroids();
    this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outerRadius);

};
THREEx.Planets._RingGeometry.prototype = Object.create(THREE.Geometry.prototype);

function SolarSystem(scene) {
    this.sunRadius = 10;
    this.SunRadiusRatio = 109.1;
    var tmpAdjust = 10;//here because for such distances
    // distant celestial bodies require extra small floats
    this.AU = this.sunRadius / 0.00464913034 / tmpAdjust;
    // Gaussian Gravitational Constant
    // in terms of AU, Solar Mass and mean solar day
    // see http://en.wikipedia.org/wiki/Gravitational_constant
    // unit are AU^(3/2)*D-1*S^(-1/2)
    this.G = 0.01720209895;
    this.solarSystem = new THREE.Object3D();
    this.sun = new Sun(this, scene);
    this.solarSystem.add(this.sun.mesh);

    this.mercury = new Mercury(this, scene);
    this.solarSystem.add(this.mercury.mesh);

    this.venus = new Venus(this, scene);
    this.solarSystem.add(this.venus.mesh);

    this.earth = new Earth(this, scene);
    this.solarSystem.add(this.earth.mesh);

    this.mars = new Mars(this, scene);
    this.solarSystem.add(this.mars.mesh);

    this.jupiter = new Jupiter(this, scene);
    this.solarSystem.add(this.jupiter.mesh);

    this.saturn = new Saturn(this, scene);
    this.solarSystem.add(this.saturn.mesh);

    this.uranus = new Uranus(this, scene);
    this.solarSystem.add(this.uranus.mesh);

    this.neptune = new Neptune(this, scene);
    this.solarSystem.add(this.neptune.mesh);

    this.pluto = new Pluto(this, scene);
    this.solarSystem.add(this.pluto.mesh);
    scene.add(this.solarSystem);
};

SolarSystem.prototype.updatePhysics = function() {
    this.sun.updatePhysics();
    this.venus.updatePhysics();
    this.mercury.updatePhysics();
    this.earth.updatePhysics();
    this.mars.updatePhysics();
    this.jupiter.updatePhysics();
    this.saturn.updatePhysics();
    this.uranus.updatePhysics();
    this.neptune.updatePhysics();
    this.pluto.updatePhysics();
};
