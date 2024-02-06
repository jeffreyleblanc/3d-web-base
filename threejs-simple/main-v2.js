import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//-- Core Components -----------------------------------------//

    // Will hold our objects
    const scene = new THREE.Scene();

    // Note there are multiple cameras available
    // 75 => field of view
    // aspect ratio
    // near and far clipping planes
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // Docs have good notes on this
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

//-- Lights -----------------------------------------//

    const lighta = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( lighta );

    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.25 );
    scene.add( light );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5, {
        position: new THREE.Vector3(15,0,0)
    } );
    scene.add( directionalLight );

//-- Helpers -----------------------------------------//

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

//-- Objects -----------------------------------------//

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

//-- Controls -----------------------------------------//

    const controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 20, 100 );
    controls.update();

//-- Loop -----------------------------------------//

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        requestAnimationFrame( animate );

        controls.update();

        renderer.render( scene, camera );
    }
    animate();