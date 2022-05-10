import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'
import gsap from 'gsap'

// Debug
const gui = new dat.GUI() //Petit tableau en haut pour ajouter des trucs

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const scene2 = new THREE.Scene();

// Lights

//var ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 ); on voit pas les polygones
//scene.add( ambientLight );

//var dirLight = new THREE.DirectionalLight( 0xffffff, 0.8 ); pareil
//scene.add( dirLight );

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
//scene2.add(pointLight2);
//scene2.add(pointLight3);

/**
 * Bouton
 */
var element=document.getElementById("myBtn");
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
 * Axes
 */
//const axesHelper = new THREE.AxesHelper( 5 ); //Pour afficher les axes mais on peut l'enlever; pour s'aider
//scene.add( axesHelper );

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 11; //Position de la caméra
camera.position.y = 3;
camera.position.z = 0;                             //Pour la caméra qui va transitionner on commence pas à 0
camera.lookAt(-10,-25,0); //Là où elle regarde (donc ici le centre)         //Pareil sinon ça regarde pas en 0,0
                    //Comme elle est en hauteur elle regarde vers le bas
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.gammaOutput = true; //Sinon c'est pas les mêmes couleurs, blender utilise les gammas mais threejs
                            //les désactive par défaut
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
const renderer2 = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer2.gammaOutput = true; //Sinon c'est pas les mêmes couleurs, blender utilise les gammas mais threejs
                            //les désactive par défaut
renderer2.setSize(sizes.width, sizes.height)
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Loader //////////////////////////////////////////////////////////////////////////:
 */
const loader = new GLTFLoader();
let tl=gsap.timeline(); //sert à l'animation

loader.load( 'firstterrain_principled.glb', function ( gltf ) { //Le modèle du sol ,vient de blender
    
    //gltf.scene.scale.set(0.5, 0.5, 0.5); //Pour rétrécir/grossir l'objet
    /*gltf.scene.traverse( child => {
        if ( child.material ) child.material.metalness = 0;
    } ); Force le metalness à 0, uniquement parfois utilisé si un modèle 3D est sans couleurs*/
    gltf.scene.rotation.y=4.7;
    gltf.scene.name="Steeven";
    scene2.add(gltf.scene); //Première fois qu'on load la scène, elle apparait donc dès le début


    /*setTimeout(function() { //Avec du délai, on décide de l'enlever

        scene.remove(gltf.scene);
      }, 4000);*/
    //gui.add(gltf.scene.rotation,'x').min(0).max(9); //Pour "rotationner" l'objet, pas la caméra
    //gui.add(gltf.scene.rotation,'z').min(0).max(9);
    //gui.add(gltf.scene.rotation,'y').min(0).max(9);
/**
 * Animation de départ (compris dans le loader)
 */
    tl.to(camera.position,{x:10,y:8,ease:"none",duration:2});
    
});
loader.load('Desert.glb', function ( gltf2 ) {
    scene.add(gltf2.scene);
    /*setTimeout(function() { //On l'ajoute au même moment qu'on enlève l'autre
        scene.add(gltf2.scene);
      }, 4000);*/

});
//element.addEventListener("click", function() {

/**
 * Animate,
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()


    // Update Orbital Controls
    // controls.update()

    /*setTimeout(function() { //On l'ajoute au même moment qu'on enlève l'autre
        scene.add(gltf2.scene);
      }, 4000);*/

    // Render
    //renderer.autoClear=false;
    renderer.autoClear=false;
    renderer.render(scene, camera);

    element.addEventListener("click", function() {
    renderer.clear();
    renderer.render(scene2,camera);})

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()