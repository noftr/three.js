

let scene, camera, renderer, controls;

function getAspectRatio() {
  const {innerWidth, innerHeight} = window;
  return innerWidth / innerHeight;
}

function onResize() {
  camera.aspect = getAspectRatio();
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(75, getAspectRatio(), 0.1, 1000);
  camera.position.z = 500;

  // render
  var canvas = document.getElementById("canvasID");
//  renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  // controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.autoRotate = true;

  // light probe
  lightProbe = new THREE.LightProbe();
  scene.add( lightProbe );

  // light #1
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add(ambientLight);

  const lights = [
    new THREE.SpotLight(0x2363D0, 2, 0),
    new THREE.SpotLight(0xCC3F4A, .6, 0),
    new THREE.SpotLight(0x5342A0, 1, 0),
  ];

  lights[0].position.set(255, 135, 145);
  lights[1].position.set(-255, 0, -165);
  lights[2].position.set(-110, 145, 310);

  lights.forEach(light => {
    scene.add(light)
    // scene.add(new THREE.SpotLightHelper(light)) // закомитить после настройки света
  });

  // light #2
  const API = {
  	lightProbeIntensity: 1.0,
  	directionalLightIntensity: 0.2,
  	envMapIntensity: 1
  };

  directionalLight = new THREE.DirectionalLight( 0xffffff, API.directionalLightIntensity );
  directionalLight.position.set( 500, 500, 500 );
  scene.add( directionalLight );

  // add DAT.GUI
  function addDatGui(){
      var gui = new dat.GUI();

      var moveCamera = gui.addFolder('Движение камерой')
      moveCamera.add(camera.position, 'x', -500,500).step(5);
      moveCamera.add(camera.position, 'y', -500,500).step(5);
      moveCamera.add(camera.position, 'z', 200,1000).step(5);

      var moveLight1 = gui.addFolder('Положение источника света №1')
      moveLight1.add(lights[0].position, 'x', -500,500).step(5);
      moveLight1.add(lights[0].position, 'y', -500,500).step(5);
      moveLight1.add(lights[0].position, 'z', -500,500).step(5);

      var moveLight2 = gui.addFolder('Положение источника света №2')
      moveLight2.add(lights[1].position, 'x', -500,500).step(5);
      moveLight2.add(lights[1].position, 'y', -500,500).step(5);
      moveLight2.add(lights[1].position, 'z', -500,500).step(5);

      var moveLight3 = gui.addFolder('Положение источника света №3')
      moveLight3.add(lights[2].position, 'x', -500,500).step(5);
      moveLight3.add(lights[2].position, 'y', -500,500).step(5);
      moveLight3.add(lights[2].position, 'z', -500,500).step(5);
  }
  addDatGui()

  return new Promise((resolve, reject) => {
  const loader = new THREE.GLTFLoader();
    loader.crossOrigin = '';
    loader.load('https://raw.githubusercontent.com/noftr/three.js/main/conus-metal.gltf', gltf => {

      // change material for gtlf
      gltf.scene.traverse( child => {
        if ( child.material ) child.material.metalness = 0.8;
        if ( child.material ) child.material.roughness = 0.3;
      } );

      scene.add(gltf.scene);

      window.addEventListener('resize', onResize);
      resolve();
    }, undefined, reject);
  });

}

// cycle function
function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

init().then(render);




// const e=document.createElement("canvas")

//  a.WebGLRenderer({canvas:e,context:t,alpha:!1,antialias:!1,stencil:!1,depth:!1,powerPreference:"high-performance"});

//  i.setPixelRatio(.01),
//  i.setSize(this.winSize.width,this.winSize.height),
//  i.outputEncoding=a.GammaEncoding,
//  i.autoClear=!1,
//  i.toneMapping=y.Linear,
//  i.shadowMap.type=a.PCFSoftShadowMap;
