import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    directionalLight.position.set(15,15,0);
    scene.add( directionalLight );

    const helper = new THREE.DirectionalLightHelper( directionalLight, 1 );
    scene.add( helper );

    // Note this doesn't seem to reflect off the lambert mesh
    const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
    pointLight.position.set( 10, 10, 10 );
    scene.add( pointLight );

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );

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
    cube.position.set(2,2,0);

    const geometry2 = new THREE.BoxGeometry( 1, 2, 3 );
    const material2 = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
    const cube2 = new THREE.Mesh( geometry2, material2 );
    scene.add( cube2 );
    cube2.position.set(10,5,3);

//-- Lines ---------------------------------------------//

    //create a blue LineBasicMaterial
    const line_material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const line_geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( line_geometry, line_material );

    scene.add( line );

//-- Text ---------------------------------------------//

    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html

    // https://threejs.org/docs/#manual/en/introduction/Creating-text

    // var content = '<div>' +
    //   '<h1>This is an H1 Element.</h1>' +
    //   '<span class="large">Hello Three.js cookbook</span>' +
    //   '<textarea> And this is a textarea</textarea>' +
    // '</div>';

//     // const loader = new FontLoader();
// const loader = new FontLoader();


// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

//     const geometry = new TextGeometry( 'Hello three.js!', {
//         font: font,
//         size: 80,
//         height: 5,
//         curveSegments: 12,
//         bevelEnabled: true,
//         bevelThickness: 10,
//         bevelSize: 8,
//         bevelOffset: 0,
//         bevelSegments: 5
//     } );
// } );

    const model_loader = new GLTFLoader();

    model_loader.load( 'public/model1.glb', function ( gltf ) {
        console.log("ADDED!")
        scene.add( gltf.scene );

        window.MODEL = gltf.scene;
        gltf.scene.scale.set(10,10,10)

    }, undefined, function ( error ) {

        console.error( error );

    } );

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