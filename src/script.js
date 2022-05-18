import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Camera, Scene } from 'three'
import gsap from 'gsap'

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
const colorWh = 0xfafafa;
const colorRd = 0xff0000; 
const colorValid = 0x16AAE1;
const addNewBoxMesh = (x, y, z, nb) => { //modele balise niveau placable
    const boxGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    let boxMaterial;
    if(nb == nbNivFini){
        boxMaterial = new THREE.MeshPhongMaterial({ color: colorWh, });
    }
    else if(nb > nbNivFini){
        boxMaterial = new THREE.MeshPhongMaterial({ color: colorRd, });
        boxMaterial.transparent = flase;
        boxMaterial.opacity = 1;
    }
    else{
        boxMaterial = new THREE.MeshPhongMaterial({ color: colorValid, });
    }
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(x, y, z);
    boxMesh.userData.id = nb; //id /!\
    scene.add(boxMesh);
}

//game variables
let whScene = 0; //0 map gl | 1-x num jeu
let nbNivFini = 3; //nb de niveaux déjà fait

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

function removeEver() {
    while (scene.children.length) {
        scene.remove(scene.children[0]);
    }
}

function loadMapGlob() {
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

function raysGlobal() { //Raycaster et addEventListeners
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var preums = 0;

    const onMouseMove = (event) => { //utilisé pour le hover
        if (preums) {
            if(preums.userData.id == nbNivFini){
                preums.material.color.set(colorWh);
            }
            else if(preums.userData.id > nbNivFini){
                preums.material.color.set(colorRd);
            }
            else{
                preums.material.color.set(colorValid);
            }
        }
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            intersects[0].object.material.color.set(colorRd);
            preums = intersects[0].object;
        }
    }

    const onClick = (event) => { //utilisé pour le click (logique)
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects[0].object.userData.id != undefined && intersects[0].object.userData.id <= nbNivFini) {
            whScene = intersects[0].object.userData.id;
            removeEver();
            loadMapGame();
        }
        else if(intersects[0].object.userData.id > nbNivFini){//marche pas
            console.log("niveau bloqué");
        }
        else{
            console.log("error onClick");
        }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick); //click ou mouseup au choix
}

function loadMapGame() {
    camera.position.x = 11; //Position de la caméra
    camera.position.y = 3;
    camera.position.z = 0;                             //Pour la caméra qui va transitionner on commence pas à 0
    camera.lookAt(-10, -25, 0); //Là où elle regarde (donc ici le centre)         //Pareil sinon ça regarde pas en 0,0
    //Comme elle est en hauteur elle regarde vers le bas
    renderer.gammaOutput = true;
    const pointLight = new THREE.PointLight(0xffffff, 3); //Lumière statique du dessus pour éclairer les polygones
    pointLight.position.x = 0;
    pointLight.position.y = 0.2;
    pointLight.position.z = 0;
    const pointLight2 = new THREE.PointLight(0xffffff, 1); //Pareil de côté
    pointLight2.position.x = 10;
    pointLight2.position.y = 0.3;
    pointLight2.position.z = -10;
    const pointLight3 = new THREE.PointLight(0xffffff, 2); //Pareil
    pointLight3.position.x = 0;
    pointLight3.position.y = 0;
    pointLight3.position.z = 2;
    scene.add(pointLight);
    scene.add(pointLight2);
    scene.add(pointLight3);
    camera.position.x = 11; //Position de la caméra
    camera.position.y = 3;
    camera.position.z = 0;                             //Pour la caméra qui va transitionner on commence pas à 0
    camera.lookAt(-10, -25, 0);
    let tl=gsap.timeline(); //sert à l'animation
    gltfLoader.load('firstterrain_principled.glb', function (gltf) { //Le modèle du sol ,vient de blender
        //gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.rotation.y = 4.7;
        scene.add(gltf.scene); //Première fois qu'on load la scène, elle apparait donc dès le début
        /**
         * Animation de départ (compris dans le loader)
         */
        tl.to(camera.position, { x: 10, y: 8, ease: "none", duration: 2 });
    });
}

function finDeGame(){ //ce qui est fait quand on finit un niveau (gg)
    nbNivFini = whScene;
}