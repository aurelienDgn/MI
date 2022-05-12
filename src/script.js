import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Camera, Scene } from 'three'

//INIT
const gltfLoader = new GLTFLoader()
//const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
camera.rotation.x = 0
camera.rotation.y = 0
camera.rotation.z = 0
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const addNewBoxMesh = (x, y, z, nb) => { //modele balise niveau placable
    const boxGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa, });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(x, y, z);
    boxMesh.userData.id = nb; //id /!\
    scene.add(boxMesh);
}

loadMapGlob();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */

const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()// Update Orbital Controls
    renderer.render(scene, camera)// Render
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function loadMapGlob(){
    camera.position.x = 0
    camera.position.y = 10
    camera.position.z = 10
    camera.rotation.x = -0.5
    camera.rotation.y = 0
    camera.rotation.z = 0
    gltfLoader.load('globMap.gltf', (gltf) => { //load map globale
        gltf.scene.scale.set(1, 1, 1)
        gltf.scene.rotation.set(0, 0, 0)
        scene.add(gltf.scene)
    })
    raysGlobal();
    genBalisesGlob();
    genLightGlob();
}

function genBalisesGlob() { //gen balises
    addNewBoxMesh(7, -0.3, 0.9, 1);
    addNewBoxMesh(4.2, -0.3, 0, 2);
    addNewBoxMesh(1.4, -0.3, 1, 3);
    addNewBoxMesh(-0.7, -0.3, 2.8, 4);
    addNewBoxMesh(-4.5, -0.3, 2.8, 5);
    addNewBoxMesh(-7.5, -0.3, 2.1, 6);
    addNewBoxMesh(-10, -0.3, -0.3, 7);
    addNewBoxMesh(-11.2, -0.24, -3, 8);
}

function genLightGlob() { //gen light glob
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.x = 0
    pointLight.position.y = 10
    pointLight.position.z = 0
    const pointLight2 = new THREE.PointLight(0xffffff, 1)
    pointLight2.position.x = 4
    pointLight2.position.y = 10
    pointLight2.position.z = 4
    const pointLight3 = new THREE.PointLight(0xffffff, 1)
    pointLight3.position.x = -4
    pointLight3.position.y = 10
    pointLight3.position.z = -4
    scene.add(pointLight)
    scene.add(pointLight2)
    scene.add(pointLight3)
    const ambLight = new THREE.AmbientLight(0xffffff, 3) // soft white light
    scene.add(ambLight)
}

function raysGlobal(){ //Raycaster et addEventListeners
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var preums = 0;
    
    const onMouseMove = (event) => { //utilisé pour le hover
        if (preums) {
            preums.material.color.set(0xfafafa);
        }
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            intersects[0].object.material.color.set(0xff0000);
            preums = intersects[0].object;
        }
    }
    
    const onClick = (event) => { //utilisé pour le click (logique)
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects[0].object.userData.id && intersects[0].object.userData.id == 9) {//cond
            //fonction(blabla)
            console.log("ca marche");
        }
        else if (intersects[0].object.userData.id != undefined) {
            console.log(intersects[0].object.userData.id);
        }
        else {//marche pas
            console.log("tdc")
        }
    }
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick); //click ou mouseup au choix
}