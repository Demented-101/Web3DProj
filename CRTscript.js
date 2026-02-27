let scene, camera, renderer, clock, mixer, actions = [], mode;

init();

function init() {
    const assetPath = './assets/Blends/'; // Path to assets

    bgTimer = 0;
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00aaff);
    
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(ambient);
    
    const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    light.position.set(0, 10, 2);
    scene.add(light);
    
    const canvas = document.getElementById('threeContainer');
    renderer = new THREE.WebGLRenderer({ canvas: canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    onResize();

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    mode = 'open';
    const btnA = document.getElementById("btn-turn-on");
    btnA.addEventListener('click', function() {
        if (actions.length === 2) {
            if (mode === "open") {
                actions.forEach(action => {
                    action.timeScale = 1;
                    action.reset();
                    action.play();
                    });
                }
            }
    });

    const btnB = document.getElementById("btn-edjust");
 
    // Load the glTF model
    const loader = new THREE.GLTFLoader();
    loader.load(assetPath + 'CRTv1.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
   
    // Set up animations
    mixer = new THREE.AnimationMixer(model);
    const animations = gltf.animations;

    animations.forEach(clip => {
      const action = mixer.clipAction(clip);
      actions.push(action);
    });

  });
 


  // Handle resizing
  window.addEventListener('resize', onResize, false);
 
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

  renderer.render(scene, camera);
}

function onResize(){
    const canvas = document.getElementById('threeContainer');
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

