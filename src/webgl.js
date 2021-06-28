import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import vertex from './shaders/vertex.glsl?raw';
import fragment from './shaders/fragment.glsl?raw';

export default class WebGL {
    constructor(options) {

        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0x1b1b1b);

        // this.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / 1000))) / Math.PI;
        this.fov = 75;

        this.camera = new THREE.PerspectiveCamera(this.fov, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.camera.position.z = 2;

        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            // alpha: true
        });

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        (options.dom).appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.clock = new THREE.Clock();

        this.resize();
        this.setupResize();
        this.playGround();
        this.tick();

    }

    setupResize() {

        window.addEventListener("resize", this.resize.bind(this));

    }

    resize() {

        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    }

    playGround() {

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            side: THREE.DoubleSide,
            wireframe: false,
            vertexShader: vertex,
            fragmentShader: fragment
        });

        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);

    }

    tick() {

        this.stats.begin();

        this.controls.update();

        let elapsedTime = this.clock.getElapsedTime();
        this.material.uniforms.time.value = elapsedTime;

        window.requestAnimationFrame(this.tick.bind(this));
        this.renderer.render(this.scene, this.camera);

        this.stats.end();

    }
}