let scene, camera, renderer, model, iswireframe = false, clock, mixer, actions = [];

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
    camera.position.set(8, 0, 0);
    
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(ambient);
    
    const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    light.position.set(2, 10, 0);
    scene.add(light);
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    
    // Load the glTF model
    const loader = new THREE.GLTFLoader();
    loader.load(assetPath + 'GameGeez.glb', function(gltf) {
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
    document.getElementById("btn-pressed-1").addEventListener('click', () => animButtons(0));
    document.getElementById("btn-pressed-2").addEventListener("click", () => animButtons(1));
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

function animButtons(index) {
    if (actions.length === 2) {
        actions[index].reset();
        actions[index].setLoop(THREE.LoopPingPong, 1);
        actions[index].play();
    };
}

function toggleWireframe(){
    iswireframe = !iswireframe;

    scene.traverse(function(obj){
        if(obj.isMesh){
            obj.material.wireframe = iswireframe;
        }
    });
}