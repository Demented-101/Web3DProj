let scene, camera, renderer, clock, mixer, actions = [], powerMode;

init();

function init() {
    bgTimer = 0;
    const assetPath = "./assets/Blends/";

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(5,0,0);

    const canvas = document.getElementById("THREEcontainer");
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    onResize();

    const ambient = new THREE.HemisphereLight(0xaaaaaa, 0xaaaaaa, 0.9);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0x888888, 2);
    light.position.set(0, 10, 4);
    scene.add(light);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    powerMode = 'Off';
    const buttonA = document.getElementById("buttonA");
    buttonA.addEventListener("click", function(){
        if(actions.length === 2){
            if (powerMode === "Off"){
                actions[1].reset();
                actions[1].play();
                powerMode = "On";
            };
        };
    });

    const buttonB = document.getElementById("buttonB");
    buttonB.addEventListener("click", function(){
        if(actions.length === 2){
            actions[0].play();
        };
    });

    const loader = new THREE.GLTFLoader();
    loader.load(assetPath + "CRTv1.glb", function(gltf){
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0,0,0);

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf.animations;

        animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.timeScale = 1;
            actions.push(action);

            console.log("yo");
        });
    });

    const material = new THREE.MeshStandardMaterial({color: new THREE.Color(0xffffff)});
    const geometry = new THREE.BoxGeometry(3, 3, 3);

    box = new THREE.Mesh(geometry, material);
    scene.add(box);

    window.addEventListener("resize", onResize, false);
    update();
    console.log("fin");
}

function update() {
    requestAnimationFrame(update);
    if(mixer){
        mixer.update(clock.getDelta());
    };

    //scene.background = new THREE.Color(0, Math.sin(clock.getElapsedTime())/10 + 0.2, 0);
    renderer.render(scene, camera);
}

function onResize(){
    const canvas = document.getElementById("THREEcontainer");
    const width = canvas.innerWidth;
    const height = canvas.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

