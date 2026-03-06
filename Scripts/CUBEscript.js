let scene, camera, renderer, box, run = false;

init();

function init() {
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x770000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.append(renderer.domElement);
    renderer.domElement.style.display = "none";

    document.getElementById("CUBE").addEventListener("click", show);

    const light = new THREE.DirectionalLight();
    light.position.set(0, 1, 2);
    scene.add(light);

    const material = new THREE.MeshStandardMaterial({color: new THREE.Color(0x111111)});
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    box = new THREE.Mesh(geometry, material);
    scene.add(box);

    window.addEventListener("resize", onresize, false);
    update();
}

function show() {
    renderer.domElement.style.display = "block";
    run = true
}

function update() {
    requestAnimationFrame(update);

    if (!run){return;}
    box.rotation.y += 0.01;
    scene.background = new THREE.Color(Math.sin(box.rotation.y)/4 + 0.2, 0, 0);

    renderer.render(scene, camera);
}

function onresize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}