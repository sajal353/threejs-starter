import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import vertex from "./shaders/vertex.glsl?raw";
import fragment from "./shaders/fragment.glsl?raw";

const initWebGL = (canvas: HTMLCanvasElement) => {
  const stats = new Stats();
  stats.showPanel(0);

  document.body.appendChild(stats.dom);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();

  const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / 1000))) / Math.PI;

  const camera = new THREE.PerspectiveCamera(
    fov,
    sizes.width / sizes.height,
    0.1,
    2000
  );

  camera.position.z = 1000;

  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const clock = new THREE.Clock();

  // --------------------------------

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    side: THREE.DoubleSide,
    wireframe: false,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  const geometry = new THREE.PlaneGeometry(
    window.innerWidth,
    window.innerHeight,
    100,
    100
  );

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // --------------------------------

  const render = () => {
    stats.begin();

    controls.update();

    let elapsedTime = clock.getElapsedTime();
    material.uniforms.time.value = elapsedTime;

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
  };

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  render();
};

export default initWebGL;
