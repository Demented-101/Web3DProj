let scene, camera, renderer, model, iswireframe = false, clock, mixer, actions = [], isActive = "off";

init();

function init() {
    const assetPath = './assets/Blends/'; // Path to assets

    bgTimer = 0;
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00aaff);
    
    const canvas = document.getElementById('threeContainer');
    renderer = new THREE.WebGLRenderer({ canvas: canvas});
    renderer.setPixelRatio(canvas.devicePixelRatio);
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(5, 0, 0);
    
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(ambient);
    
    const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    light.position.set(0, 10, 2);
    scene.add(light);
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    
    // Load the glTF model
    const loader = new THREE.GLTFLoader();
    loader.load(assetPath + 'CRTv1.glb', function(gltf) {
        // load the model and add to scene
        model = gltf.scene;
        scene.add(model);
        
        // Set up animations
        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;
        
        animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.timeScale = 1;
            actions.push(action);
        });
    });
    
    // setup buttons
    document.getElementById("btn-turn-on").addEventListener('click', animTurnOn);
    document.getElementById("btn-edjust").addEventListener("click", animEdjust);
    document.getElementById("btn-wireframe").addEventListener("click", toggleWireframe);

    // Handle resizing
    window.addEventListener('resize', onResize, false);
    onResize();
    
    // Start the animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Update animations
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    scene.background = new THREE.Color(0, Math.sin(clock.getElapsedTime())/10 + 0.2, 0);
    renderer.render(scene, camera);
}

function onResize(){
    const canvas = document.getElementById('threeContainer');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

function animTurnOn() {
    if (actions.length === 2) {
        if (isActive === "off") {
            actions[1].setLoop(THREE.loopOnce, 1);
            actions[1].clampWhenFinished = true
            actions[1].play();
            isActive = "on";
        };
    }
}

function animEdjust(){
    if (actions.length === 2){
        actions[0].reset();
        actions[0].setLoop(THREE.LoopPingPong, 2);
        actions[0].play();
    }
}

function toggleWireframe(){
    iswireframe = !iswireframe;

    scene.traverse(function(obj){
        if(obj.isMesh){
            obj.material.wireframe = iswireframe;
        }
    });
}