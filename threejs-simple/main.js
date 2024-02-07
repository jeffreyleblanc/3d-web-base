import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class BaseScene {

    constructor(canvas_el){
        // Setup our renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas_el
        });
        this.renderer.setSize(window.innerWidth,window.innerHeight);

        // Make the root scene node
        this.scene = new THREE.Scene();

        // Setup the camera
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

        // Setup the interaction controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.update() must be called after any manual changes to the camera's transform
        this.camera.position.set(0,20,100);
        this.controls.update();
    }

    on_update(){
        this.controls.update();
        this.renderer.render(this.scene,this.camera);
    }
}

function main(){
    //-- Core Components -----------------------------------------//

        const canvas_el = document.getElementById("main_canvas");
        console.log("canvas_el",canvas_el);

        const M = new BaseScene(canvas_el);


    //-- Lights -----------------------------------------//

        const lighta = new THREE.AmbientLight( 0x404040 ); // soft white light
        M.scene.add( lighta );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
        directionalLight.position.set(15,15,0);
        M.scene.add( directionalLight );

        const helper = new THREE.DirectionalLightHelper( directionalLight, 1 );
        M.scene.add( helper );

    //-- Helpers -----------------------------------------//

        const size = 10;
        const divisions = 10;

        const gridHelper = new THREE.GridHelper( size, divisions );
        M.scene.add( gridHelper );

        const axesHelper = new THREE.AxesHelper( 5 );
        M.scene.add( axesHelper );

    //-- Objects -----------------------------------------//

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        M.scene.add( cube );
        cube.position.set(2,2,0);

        const geometry2 = new THREE.BoxGeometry( 1, 2, 3 );
        const material2 = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
        const cube2 = new THREE.Mesh( geometry2, material2 );
        M.scene.add( cube2 );
        cube2.position.set(10,5,3);

    //-- Lines ---------------------------------------------//

        //create a blue LineBasicMaterial
        const line_material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 4
        });

        const points = [];
        points.push( new THREE.Vector3( - 10, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 10, 0 ) );
        points.push( new THREE.Vector3( 10, 0, 0 ) );

        const line_geometry = new THREE.BufferGeometry().setFromPoints( points );

        const line = new THREE.Line( line_geometry, line_material );

        M.scene.add( line );

    //-- Loop -----------------------------------------//

        function animate() {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            requestAnimationFrame( animate );

            M.on_update();

        }
        animate();
}
main();
