import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Camera, Scene } from 'three'

const gltfLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Map
gltfLoader.load('globMap.gltf', (gltf) => {
    gltf.scene.scale.set(1,1,1)
    gltf.scene.rotation.set(0,0,0)
    scene.add(gltf.scene)

    //gui add (tests)
    gui.add(gltf.scene.position, 'x').min(0).max(9)
    gui.add(gltf.scene.position, 'y').min(0).max(9)
    gui.add(gltf.scene.position, 'z').min(0).max(9)
})


//TESTS CARRES RAY
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const addNewBoxMesh = (x,y,z) =>{
    const boxGeometry = new THREE.BoxGeometry(1,1,1);
    const boxMaterial = new THREE.MeshPhongMaterial({color: 0xfafafa,});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(x,y,z);
    scene.add(boxMesh);
}

for(let i = 0; i < 3; i++){
    for(let y = 0; y < 3; y++){
        for(let z = 0; z < 3; z++){
            addNewBoxMesh(i*2,y*2+3,z*2);
        }
    }
}
//TESTS CARRE RAY

// Lights

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

const ambLight = new THREE.AmbientLight(0xffffff, 3); // soft white light
scene.add( ambLight );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 10
camera.rotation.x = -0.5
camera.rotation.y = 0
camera.rotation.z = 0
scene.add(camera)
gui.add(camera.rotation, 'x').min(0).max(9)
gui.add(camera.rotation, 'y').min(0).max(9)
gui.add(camera.rotation, 'z').min(0).max(9)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()