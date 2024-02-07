import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {VRButton} from 'three/addons/webxr/VRButton.js';

class BaseScene {

    constructor(canvas_el){
        // Initial sizing
        let canvas_w = canvas_el.clientWidth;
        let canvas_h = canvas_el.clientHeight;

        // Setup our renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas_el
        });
        this.renderer.setSize(canvas_w,canvas_h,false);

        // Enable for VR
        this.renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(this.renderer));

        // Attach a resize observer
        this.resizeObserver = new ResizeObserver((event)=>{
            const el = event[0].target;
            const cbbox = el.getBoundingClientRect();
            const canvas_w = cbbox.width;
            const canvas_h = cbbox.height;

            // Update the size
            this.renderer.setSize(canvas_w,canvas_h,false);
            // Update the camera
            this.camera.aspect = canvas_w/canvas_h;
            this.camera.updateProjectionMatrix();

        });
        this.resizeObserver.observe(canvas_el);

        // Make the root scene node
        this.scene = new THREE.Scene();

        // Setup the camera
        const fov = 75;
        const aspect = canvas_w/canvas_h;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

        // Setup the interaction controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.update() must be called after any manual changes to the camera's transform
        this.camera.position.set(0,20,100);
        this.controls.update();

        // Maps
        this.helper_map = {};
        this.light_map = {};
        this.object_map = {};
    }

    add_light(key, light){
        this.light_map[key] = light;
        this.scene.add(light);
    }

    add_object(key, object){
        this.object_map[key] = object;
        this.scene.add(object);
    }

    add_helper(key, helper){
        this.helper_map[key] = helper;
        this.scene.add(helper);
    }

    on_update(){
        this.controls.update();
        this.renderer.render(this.scene,this.camera);
    }
}

function main(){
    // Setup the manager
    const canvas_el = document.getElementById("main_canvas");
    const M = new BaseScene(canvas_el);
    window.$M = M;


    //-- Lights -----------------------------------------//

        // Lights can be turn on/off with `.visible = bool`

        const al_color = 0x777777;
        const al_intensity = 0.5;
        const ambient_light = new THREE.AmbientLight(al_color,al_intensity);
        M.add_light("ambient",ambient_light);

        // Add a directional light
        const dl_color1 = 0xFF8888;
        const dl_intensity1 = 0.5;
        const directional_light1 = new THREE.DirectionalLight(dl_color1,dl_intensity1);
        directional_light1.position.set(15,15,0);
        // the way this work is: directional_light1.target.set( an_object);
        M.add_light("directional1",directional_light1);

        // Add a directional light helper
        const dl_helper1 = new THREE.DirectionalLightHelper(directional_light1,1);
        M.add_helper("directional_light1",dl_helper1);

    //-- Helpers -----------------------------------------//

        // Note that these helpers can be added to any node

        const size = 10;
        const divisions = 10;
        const grid_helper = new THREE.GridHelper( size, divisions );
        M.add_helper("grid_helper",grid_helper);

        const axes_helper = new THREE.AxesHelper( 5 );
        M.add_helper("axes_helper",axes_helper);

    //-- Objects -----------------------------------------//

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        const cube = new THREE.Mesh( geometry, material );
        M.scene.add( cube );
        cube.position.set(2,2,0);

        const geometry2 = new THREE.BoxGeometry( 1, 2, 3 );
        const material2 = new THREE.MeshPhongMaterial( { color: 0xffff44 } );
        const cube2 = new THREE.Mesh( geometry2, material2 );
        M.scene.add( cube2 );
        cube2.position.set(10,5,3);

    //-- Lines ---------------------------------------------//

        // Note the line stays same width

        //create a blue LineBasicMaterial
        const line_material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 2
        });

        const points = [];
        points.push( new THREE.Vector3( - 10, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 10, 0 ) );
        points.push( new THREE.Vector3( 10, 0, 0 ) );

        const line_geometry = new THREE.BufferGeometry().setFromPoints( points );

        const line = new THREE.Line( line_geometry, line_material );

        M.scene.add( line );

    //-- Loop -----------------------------------------//

        function render(time_ms=0){
            // Rotate main cube
            cube.rotation.x = time_ms/1000;
            cube.rotation.y = time_ms/5000;
            M.on_update();
        }
        // Let renderer run animation to support AR/VR
        M.renderer.setAnimationLoop(render);
}
main();
