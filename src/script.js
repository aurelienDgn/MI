import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Camera, Scene } from 'three'
import gsap from 'gsap'

//Init class Level
const level = new Level();

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
const colorBk = 0x000000;
const colorValid = 0x16AAE1;
const addNewBoxMesh = (x, y, z, nb) => { //modele balise niveau placable
    const boxGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    let boxMaterial;
    if(nb == nbNivFini){
        boxMaterial = new THREE.MeshPhongMaterial({ color: colorWh, });
    }
    else if(nb > nbNivFini && nb <= nivMax){
        boxMaterial = new THREE.MeshPhongMaterial({ color: colorRd, });
        boxMaterial.transparent = false;
        boxMaterial.opacity = 1;
    }
    else if(nb > nbNivFini && nb > nivMax){
        boxMaterial = new THREE.MeshPhongMaterial({ color: colorBk, });
        boxMaterial.transparent = false;
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
let nbNivFini = 1; //nb du niv actuel
let nivMax = 3;

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

    const onMouseMove = (event) => { //utilis?? pour le hover
        if (preums) {
            if(preums.userData.id == nbNivFini){
                preums.material.color.set(colorWh);
            }
            else if(preums.userData.id > nbNivFini && preums.userData.id <= nivMax){
                preums.material.color.set(colorRd);
            }
            else if(preums.userData.id > nbNivFini && preums.userData.id > nivMax){
                preums.material.color.set(colorBk);
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
            if(intersects[0].object.userData.id <= nbNivFini){
                intersects[0].object.material.color.set(colorRd);
            }
            else if(intersects[0].object.userData.id > nbNivFini && intersects[0].object.userData.id <= nivMax){
                intersects[0].object.material.color.set(0x1C0101);
            }
            else{
                intersects[0].object.material.color.set(0x0C0C0C);
            }
            preums = intersects[0].object;
        }
    }

    const onClick = (event) => { //utilis?? pour le click (logique)
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if(whScene == 0){//map glob
            try{
            if (intersects[0].object.userData.id != undefined && intersects[0].object.userData.id <= nbNivFini) {
                whScene = intersects[0].object.userData.id;
                level.setLevel(intersects[0].object.userData.id);
                removeEver();
                loadMapGame(intersects[0].object.userData.id);
            }
            else if(intersects[0].object.userData.id > nbNivFini || intersects[0].object.userData.id > nivMax){//marche pas
                console.log("niveau bloqu??");
            }
            else{
                console.log("error onClick");
            }
        } catch {
            //console.log("erreur quand on clique autre part qu'un bouton raycaster");
        }
        }
        else{//map game
            try{
                if(intersects[0].object.name == "ceiling"){
                    if(intersects[0].object.material.transparent == true && intersects[0].object.material.opacity == 0.3){
                        console.log("1");
                        intersects[0].object.material.transparent = true;
                        intersects[0].object.material.opacity = 1;
                    }
                    else{
                        console.log("2");
                        intersects[0].object.material.transparent = true;
                        intersects[0].object.material.opacity = 0.3;
                    }
                    }
        }catch{
            //console.log("erreur quand on clique autre part qu'un bouton raycaster");
            console.log("3");
            console.log(intersects[0].object);
        }
        }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick); //click ou mouseup au choix
}

function loadMapGame(id) {
    camera.position.x = 11; //Position de la cam??ra
    camera.position.y = 3;
    camera.position.z = 0;                             //Pour la cam??ra qui va transitionner on commence pas ?? 0
    camera.lookAt(-10, -25, 0); //L?? o?? elle regarde (donc ici le centre)         //Pareil sinon ??a regarde pas en 0,0
    //Comme elle est en hauteur elle regarde vers le bas
    renderer.gammaOutput = true;
    const pointLight = new THREE.PointLight(0xffffff, 3); //Lumi??re statique du dessus pour ??clairer les polygones
    pointLight.position.x = 0;
    pointLight.position.y = 0.2;
    pointLight.position.z = 0;
    const pointLight2 = new THREE.PointLight(0xffffff, 1); //Pareil de c??t??
    pointLight2.position.x = 10;
    pointLight2.position.y = 0.3;
    pointLight2.position.z = -10;
    const pointLight3 = new THREE.PointLight(0xffffff, 2); //Pareil
    pointLight3.position.x = 0;
    pointLight3.position.y = 0;
    pointLight3.position.z = 2;
    const pointLight4 = new THREE.PointLight(0xffffff, 2); //Pareil
    pointLight4.position.set(-7,1.5,5);
    scene.add(pointLight4);
    scene.add(pointLight);
    scene.add(pointLight2);
    scene.add(pointLight3);
    loadFirst(); // Affiche la maison par d??faut
    barreElt(); // Affiche la barre d'??l??ments
    camera.position.x = 11; //Position de la cam??ra
    camera.position.y = 3;
    camera.position.z = 0;                             //Pour la cam??ra qui va transitionner on commence pas ?? 0
    camera.lookAt(-10, -25, 0);
    let tl=gsap.timeline(); //sert ?? l'animation
    if(id){
        gltfLoader.load('firstterrain_principled.glb', function (gltf) { //Le mod??le du sol ,vient de blender
            //gltf.scene.scale.set(0.5, 0.5, 0.5);
            gltf.scene.rotation.y = 4.7;
            scene.add(gltf.scene); //Premi??re fois qu'on load la sc??ne, elle apparait donc d??s le d??but
            /**
             * Animation de d??part (compris dans le loader)
             */
            tl.to(camera.position, { x: 10, y: 8, ease: "none", duration: 2 });
        });
    }
    if(id == 10){//a faire mieux
        gltfLoader.load('Desert.glb', function (gltf) { //Le mod??le du sol ,vient de blender
            //gltf.scene.scale.set(0.5, 0.5, 0.5);
            gltf.scene.rotation.y = 4.7;
            scene.add(gltf.scene); //Premi??re fois qu'on load la sc??ne, elle apparait donc d??s le d??but
            /**
             * Animation de d??part (compris dans le loader)
             */
            tl.to(camera.position, { x: 10, y: 8, ease: "none", duration: 2 });
        });
    }
}

function finDeGame(){ //ce qui est fait quand on finit un niveau (gg)
    nbNivFini = whScene;
}

function loadFirst(){

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load("textures/brick.jpg");
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.x = 0;
    texture.offset.y = 0;
    texture.repeat.set(2,2);
    
    var mat;
    var model;
    var mixer = null;
    var geo;
    
    // Positionne les murs
    
    gltfLoader.load('house.glb', function ( gltf2 ) {
        
        gltf2.scene.name = "house";
        model = gltf2.scene;
       /* gltf2.scene.traverse(function (obj){
            if((obj instanceof THREE.Mesh)){
                mat = obj.material;
                geo = obj.geometry;
                mat.map = texture;
            }
        });*/
    
    
        model.position.set(-4,0.4,2.8);
        model.scale.set(0.5,0.5,0.5);
    
        scene.add(model);
    
        //mixer = new THREE.AnimationMixer(model);
        //mixer.clipAction(gltf2.animations[4]).play();
    });
    
    
    var f = new THREE.TextureLoader();
    var d = f.load("textures/parpaing.jpg");
    d.encoding = THREE.sRGBEncoding;
    d.flipY = false;
    d.wrapS = d.wrapT = THREE.RepeatWrapping
    d.offset.x = 0;
    d.offset.y = 0;
    d.repeat.set(2,2);
    
    var mat1;
    var model1;
    var mixer1 = null;
    var geo1;
    
    gltfLoader.load('floor.glb', function ( gltf2 ) {
        
        gltf2.scene.name = "floor";
        model1 = gltf2.scene;
        /*gltf2.scene.traverse(function (obj){
            if((obj instanceof THREE.Mesh)){
                mat1 = obj.material;
                geo1 = obj.geometry;
                mat1.map = d;
            }
        });*/
    
    
        gltf2.scene.position.set(-4,0.4,2.8);
        gltf2.scene.scale.set(0.5,0.5,0.5);
    
        scene.add(model1);
    
        //mixer1 = new THREE.AnimationMixer(model1);
        //mixer1.clipAction(gltf2.animations[4]).play();
    });
    
    
    gltfLoader.load('isolant.glb', function ( gltf2 ) {
        
        /*gltf2.scene.name = "pp";
        model1 = gltf2.scene;
        gltf2.scene.traverse(function (obj){
            if((obj instanceof THREE.Mesh)){
                mat1 = obj.material;
                geo1 = obj.geometry;
                mat1.map = d;
            }
        });*/
    
    
        gltf2.scene.name = "isolant";
    
        gltf2.scene.position.set(-3.98,0.4,2.78);
        gltf2.scene.scale.set(0.48,0.48,0.48);
    
        /*let uv = geo1.getAttribute('uv');
        uv.array[0] = 1;*/
    
        scene.add(gltf2.scene);
    
        /*mixer1 = new THREE.AnimationMixer(model1);
        mixer1.clipAction(gltf2.animations[4]).play();*/
    });
    
    
    gltfLoader.load('ceiling.glb', function ( gltf2 ) {
        
        /*gltf2.scene.name = "pp";
        model1 = gltf2.scene;
        gltf2.scene.traverse(function (obj){
            if((obj instanceof THREE.Mesh)){
                mat1 = obj.material;
                geo1 = obj.geometry;
                mat1.map = d;
            }
        });*/
        let modelCeiling = gltf2.scene;

        gltf2.scene.name = "ceiling";
    
        gltf2.scene.position.set(-3.45,0.7,2.5);
        gltf2.scene.scale.set(0.4,0.4,0.4);
    
        /*let uv = geo1.getAttribute('uv');
        uv.array[0] = 1;*/
    
        scene.add(gltf2.scene);
        const robotCeiling = scene.getObjectByName("ceiling")
        const meshCeiling = new THREE.Mesh(robotCeiling.geometry, new THREE.MeshStandardMaterial())
        /*mixer1 = new THREE.AnimationMixer(model1);
        mixer1.clipAction(gltf2.animations[4]).play();*/
    });
    }
    
    function reloadobject(elt, txture){
    
        let i = scene.getObjectByName(elt);
        //console.log(i);
        scene.remove(i);
    
    
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load("textures/"+txture+".jpg");
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = false;
        texture.offset.x = 0;
        texture.offset.y = 0;
    
        var mat;
        var model;
        var mixer = null;
        var geo;
    
        const loader = new GLTFLoader();
    
        loader.load(elt+'.glb', function ( gltf2 ) {
    
            model = gltf2.scene;
            gltf2.scene.traverse(function (obj){
                if((obj instanceof THREE.Mesh)){
                    mat = obj.material;
                    geo = obj.geometry;
                    mat.map = texture;
                }
            });
    
            switch(elt){
                case "house":
                    model.position.set(-4,0.4,2.8);
                    model.scale.set(0.5,0.5,0.5);
                    break;
                case "floor":
                    gltf2.scene.position.set(-4,0.4,2.8);
                    gltf2.scene.scale.set(0.5,0.5,0.5);
                    break;
                case "isolant":
                    gltf2.scene.position.set(-3.98,0.4,2.78);
                    gltf2.scene.scale.set(0.48,0.48,0.48);
                    break;
                case "ceiling":
                    gltf2.scene.position.set(-3.45,0.7,2.5);
                    gltf2.scene.scale.set(0.4,0.4,0.4);
                    break;
    
            }
    
            scene.add(model);
    
            mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(gltf2.animations[4]).play();
        });
    }
    
    
    
    
    
    
    
    
    // Init div solde
    let soldeDiv = document.getElementById("so");
    soldeDiv.innerHTML = "Solde : "+level.getSolde(); 
    
    // Init div
    let divCaract = document.getElementById("divCar");
    
    // Init de la classe Maison
    const maison = new Maison();

    // Init liste Materiaux
    let listMat = document.getElementById("listMat");

    let listMur = document.getElementById("listMur");
    let listSol = document.getElementById("listSol");
    let listToit = document.getElementById("listToit");
    let listChauff = document.getElementById("listChauff");
    let listIso = document.getElementById("listIso");

    let btnValidate = document.getElementById("ok");
    btnValidate.addEventListener('click', function(){
        
        if(level.niv(maison.getMur(), maison.getSol(), maison.getToit(), maison.getChauffage())){
            if(whScene == nbNivFini && whScene != nivMax){
                nbNivFini += 1;
            }
            removeEver();
            loadMapGlob();
            whScene = 0;
            
            listMur.textContent = "- Murs :";
            listSol.textContent = "- Sol :";
            listToit.textContent = "- Toit :";
            listChauff.textContent = "- Chauffage :";
            maison.setMur("Rien");
            maison.setSol("Rien");
            maison.setChauffage("Rien");
            maison.setToit("Rien");
            listMat.style.visibility = "hidden";
            barre.style.visibility = "hidden";
            soldeDiv.style.visibility = "hidden";
            printCaract("Retour");
        }
    });
    
    
    // Initialisation de la barre
    
    // Il faudra r??cup??rer un json avec la liste des ??l??ments
    
    // le tableau sera r??cup de le json a terme
    
    let tabElt = ["Murs", "Toit", "Sol", "Chauffage"/*, "Isolant"*/];
    let imgElt = ["Image/walls.png", "Image/toit.png", "Image/floor.png", "Image/door.png"];
    
    // Tableaux des ??l??ments ?? modifier
    let tabMatMurs = ["Retour","Parpaing", "Briques", "Bloc coffrant", "B??ton cellulaire"];
    let prixM = [800,2000,4000,2800];
    let tabMatToit = ["Retour","Tuiles", "Ardoise", "M??tal", "Zinc"];
    let prixT = [500,1000,700,900];
    let tabMatSol = ["Retour","Bois massif", "Bois lamin??", "Moquette","Vinyle","Carrelage"];
    let prixS = [1200,600,400,200,800];
    let tabMatChauff = ["Retour","Electricit??", "Gaz", "Bois", "Solaire"];
    let prixC = [500,700,600,1300];
    //let tabMatIso = ["Retour","Iso1", "Iso2", "Iso3", "Iso4"];
    
    // Tableaux des images des mat??riaux des diff??rents ??l??ments
    let imgMatMurs = ["Image/croix.png","Image/murs/cinder.png", "Image/murs/brick.jpg", "Image/murs/cinder.png", "Image/murs/concrete.png"];
    let imgMatSol = ["Image/croix.png","Image/sol/genFloor.png", "Image/sol/genFloor.png", "Image/sol/genFloor.png","Image/sol/genFloor.png", "Image/sol/genFloor.png"];
    let imgMatToit = ["Image/croix.png","Image/toit.png", "Image/toit.png", "Image/toit/metal.png", "Image/toit/metal.png"];
    let imgMatChauff = ["Image/croix.png","Image/chauffage/electric.png", "Image/chauffage/gaz.png", "Image/chauffage/wood.png", "Image/chauffage/sol.png"];
    //let imgMatIso = ["Image/croix.png","Image/wood.png", "Image/wood.png", "Image/wood.png", "Image/wood.png"];
    
    let barre = document.getElementById("barre");
    
    function getPrix(elt){

        switch (elt){
            case "house":
                return prixM;
            case "ceiling":
                return prixT;
            case "floor":
                return prixS;
            case "hot":
                return prixC;
        }
    }
    
    function barreMat(mat){
        // Fonction affichant les diff??rents mat??riaux d'un ??l??ment de la maison que l'on peut modifier
        while(barre.firstChild){
            // On supprime tout les enfants de la div barre
            barre.removeChild(barre.firstChild);
        }
    
        // En fonction de l'??l??ment passer en param??tre on appelle la fonction correspondante qui va afficher les mat??riaux disponibles
        switch (mat){
            case "Murs":
                matElt(tabMatMurs, imgMatMurs, "house");
                break;
            case "Toit":
                matElt(tabMatToit, imgMatToit, "ceiling");
                break;
            case "Sol":
                matElt(tabMatSol, imgMatSol, "floor");
                break;
            case "Chauffage":
                matElt(tabMatChauff, imgMatChauff, "hot");
                break;/*
            case "Isolant":
                matElt(tabMatIso, imgMatIso, "iso");
                break;*/
        }
    }
    
    function matElt(tabMat, imgTab, elt){
        // Fonction qui affiche les mat??riaux dispo en fct de l'??l??ment pass?? en param
        let j = 0;
        for(let i=0;i<tabMat.length;i++){
            // Cr??ation des div 
            let div = document.createElement("div");
            div.id = "elt"+i;
            div.className = "elt";
        
            // Cr??ation de l'image
            let img = document.createElement("img");
            img.src = imgTab[i];
            img.className = "img";
        
            //Get price
            let prixx = getPrix(elt);

            // Cr??ation du text
            let p = document.createElement("h4");
            p.className = "nameElt";
            p.innerText = tabMat[i];

            if(i != 0){
                p.innerText += ", "+prixx[j]+"???";
                j++;
            }
        
            // On ajoute texte et image ?? la div
            div.appendChild(img);
            div.appendChild(p);
        
            // Et la div ?? la barre
            barre.appendChild(div);
    
            div.addEventListener('click', function(){
                // S??lectionne le mat??riaux cliqu?? avec l'elt
                selecElt(elt, tabMat[i]);
            });

            div.addEventListener('mouseover', function(){
                printCaract(tabMat[i]);
            })
    
            // Lance une animation de fondu 
            document.getElementById(div.id).animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: 1000
            })
    
            div.onmouseover = function(){
                div.style.backgroundColor = "antiquewhite";
            }
    
            div.onmouseout = function(){
                div.style.backgroundColor = "rgba(237, 140, 30, 0.1)";
            }
    
        }
    }
    
    function barreElt(){
        // Cr??er les ??l??ments que l'on pourra modifier
    
        listMat.style.visibility = "visible";
        barre.style.visibility = "visible";
        soldeDiv.style.visibility = "visible";
    
        // On enl??ve ce que contient la barre (au cas ou ou non)
        while(barre.firstChild){
            barre.removeChild(barre.firstChild);
        }  
    
        for(let i=0;i<tabElt.length;i++){
            // Cr??ation de la div
            let div = document.createElement("div");
            div.id = "elt"+i;
            div.className = "elt";
    
    
            div.addEventListener('click', function (){
                // Lorsque l'on clique sur un ??l??ment ??a appelle la fct qui montre les mat??riaux avec en parametre l'elt cliqu??
                barreMat(tabElt[i]);
            });
        
            // Cr??ation de l'img
            let img = document.createElement("img");
            img.src = imgElt[i];
            img.className = "img";
        
            // Cr??ation du texte
            let p = document.createElement("h4");
            p.className = "nameElt";
            p.innerText = tabElt[i];
        
            // Ajoute tout ??a dans la div
            div.appendChild(img);
            div.appendChild(p);
        
            barre.appendChild(div);
    
            div.onmouseover = function(){
                div.style.backgroundColor = "antiquewhite";
            }
    
            div.onmouseout = function(){
                div.style.backgroundColor = "rgba(237, 140, 30, 0.1)";
            }
    
            
            // Petite animation du pauvre
            let k = document.getElementById(div.id);
            k.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: 1500
            })
           /* k.style.left = "30em";
            k.style.position = "relative";
    
            function delay(n){
                return new Promise(function(resolve){
                    setTimeout(resolve,n*1000);
                });
            }
    
            let ppp = 30;
    
            async function myAsyncFunction(){
                for(let i=0;i<60;i++){
                    console.log("haaa");
                    k.style.left = ppp+"em";
                    ppp -= 0.5;
                    await delay(0.01);
    
                }
            }
    
            myAsyncFunction();   */
        }
    }
    
    
    function selecElt(elt, mat){
        //console.log(elt+", "+mat);
    
        let index = returnIndexElt(elt);

        switch(mat){
            case "Retour":
                barreElt();
                break;
            case "Parpaing":
                reloadobject(elt, "parpaing");
                maison.setMur("parpaing");
    
                listMur.textContent = "- Murs : Parpaing";
                break;
            case "Briques":
                reloadobject(elt, "brick");
                maison.setMur("brick");
    
                listMur.textContent = "- Murs : Briques";
                break;
            case "B??ton cellulaire":
                reloadobject(elt, "bloc cellulaire");
                maison.setMur("beton cellulaire");
    
                listMur.textContent = "- Murs : B??ton cellulaire";
                break;
            case "Bloc coffrant":
                reloadobject(elt, "bloc coffrant");
                maison.setMur("bloc coffrant");
    
                listMur.textContent = "- Murs : Bloc coffrant";
                break;
            case "Bois lamin??":
                reloadobject(elt, "bois lamin??");
                maison.setSol("bois lamine");
    
                listSol.textContent = "- Sol : Bois lamin??";
                break;
            case "Bois massif":
                reloadobject(elt, "bois massif");
                maison.setSol("bois massif");
    
                listSol.textContent = "- Sol : Bois massif";
                break;
            case "Carrelage":
                reloadobject(elt, "carrelage");
                maison.setSol("carrelage");
    
                listSol.textContent = "- Sol : Carrelage";
                break;
            case "Moquette":
                reloadobject(elt, "moquette");
                maison.setSol("moquette");
    
                listSol.textContent = "- Sol : Moquette";
                break;
            case "Vinyle":
                reloadobject(elt, "vinyle");
                maison.setSol("vinyle");
    
                listSol.textContent = "- Sol : Vinyle";
                break;
            case "Tuiles":
                reloadobject(elt, "tuiles");
                maison.setToit("tuiles");
    
                listToit.textContent = "- Toit : Tuiles";
                break;
            case "Ardoise":
                reloadobject(elt, "ardoise");
                maison.setToit("ardoise");
    
                listToit.textContent = "- Toit : Ardoise";
                break;
            case "M??tal":
                reloadobject(elt, "metal");
                maison.setToit("metal");
    
                listToit.textContent = "- Toit : M??tal";
                break;
            case "Zinc":
                reloadobject(elt, "zinc");
                maison.setToit("zinc");
    
                listToit.textContent = "- Toit : Zinc";
                break;
            case "Electricit??":
                maison.setChauffage("electricite");
    
                listChauff.textContent = "- Chauffage : Electricit??";
                break;
            case "Gaz":
                maison.setChauffage("gaz");
    
                listChauff.textContent = "- Chauffage : Gaz";
                break;
            case "Bois":
                maison.setChauffage("bois");
    
                listChauff.textContent = "- Chauffage : Bois";
                break;
            case "Solaire":
                maison.setChauffage("solaire");
    
                listChauff.textContent = "- Chauffage : Solaire";
                break;
            /*case "Iso1":
                //reloadobject(elt, "vinyle");
                maison.setIsolant("Iso1");
    
                listIso.textContent = "- Isolant : Iso1";
                break;
            case "Iso2":
                //reloadobject(elt, "vinyle");
                maison.setIsolant("Iso2");
    
                listIso.textContent = "- Isolant : Iso2";
                break;
            case "Iso3":
                //reloadobject(elt, "vinyle");
                maison.setIsolant("Iso3");
    
                listIso.textContent = "- Isolant : Iso3";
                break;
            case "Iso4":
                //reloadobject(elt, "vinyle");
                maison.setIsolant("Iso4");
    
                listIso.textContent = "- Isolant : Iso4";
                break;*/
        }
    }

    function returnIndexElt(elt){
    
        switch(elt){
            case "Murs":
                return 0;
                break;
            case "Toit":
                return 2;
                break;
            case "Sol":
                return 1;
                break;
            case "Chauffage":
                return 3;
                break;/*
            case "Isolant":
                return 4;
                break;*/
        }
    } 

    function printCaract(mat){

        switch(mat){
            case "Retour":
                divCaract.innerHTML = "";
                break;
            case "Parpaing":
                divCaract.innerHTML = "-qualit??s :bon march??, 100% recyclable <br> -d??fauts : mauvaise isolation, pareil pour l???isolation sonore";
                break;
            case "Briques":
                divCaract.innerHTML = " -qualit??s :bonne isolation thermique, r??siste tr??s bien au chaud <br> -d??fauts : un peu co??teux, infiltration d???eau (donc attention aux zones trop humides)";
                break;
            case "B??ton cellulaire":
                divCaract.innerHTML = " -qualit??s : bonne isolation en hiver, excellente en ??t?? <br> -d??fauts : co??teux, se fissure facilement , peut causer des cancers selon des ??tudes";
                break;
            case "Bloc coffrant":
                divCaract.innerHTML = "-qualit??s :tr??s bonne isolation thermique <br> -d??fauts : tr??s co??teux";
                break;
            case "Bois lamin??":
                divCaract.innerHTML = "-qualit??s : durable dans le temps, peu co??teux <br> -d??fauts : dur??e de vie courte, ne convient pas aux pi??ces humides, peu d???isol. Sonore";
                break;
            case "Bois massif":
                divCaract.innerHTML = "-qualit??s : durable dans le temps, tr??s bonne isolation thermique <br> -d??fauts : l???un des plus co??teux du march??, ??carts de temp??rature qui peuvent causer expansion et r??traction des planches/craquements ";
                break;
            case "Carrelage":
                divCaract.innerHTML = "-qualit??s : grande r??sistance aux temp??ratures extr??mes, solution la + hygi??nique <br> -d??fauts : co??teux, lourd ";
                break;
            case "Moquette":
                divCaract.innerHTML = "-qualit??s : tr??s peu co??teux, isolation sonore et thermique bonnes <br> -d??fauts : emprisonne la poussi??re, difficile ?? entretenir";
                break;
            case "Vinyle":
                divCaract.innerHTML = "-qualit??s : le ??? co??teux, bonne r??sistance ?? l???humidit?? <br> -d??fauts : contient des polluants, souvent inflammable (c???est du plastique)";
                break;
            case "Tuiles":
                divCaract.innerHTML = " -qualit??s : bon isolement thermique , r??sistante au feu <br> -d??fauts :  si bcp de tuiles -> cher, lourd donc ?? ??viter sur les murs fins";
                break;
            case "Ardoise":
                divCaract.innerHTML = "-qualit??s : Tr??s ??tanche, solide ; bon isolant (mat??riau naturel donc ??cologique) <br> -d??faut :  co??t ??lev??";
                break;
            case "M??tal":
                divCaract.innerHTML = "-qualit??s : Efficace contre la neige, tr??s r??sistant, 100% recyclable donc ??cologique <br> -d??fauts :  Mauvaise isolation sonore";
                break;
            case "Zinc":
                divCaract.innerHTML = "-qualit??s : ??tanche, r??sistant aux intemp??ries, l??ger <br> -d??fauts :  co??t cher, lourd donc ?? ??viter sur les murs fins, mauvaise isolation son. s???il fait chaud";
                break;
            case "Electricit??":
                divCaract.innerHTML = "-qualit??s : empreinte carbone faible, co??t modulable selon l???isolation <br> -d??fauts : chaleur mal r??partie dans les grandes pi??ces, chaleur qui ass??che l???air";
                break;
            case "Gaz":
                divCaract.innerHTML = " -qualit??s : peu co??teux, bonne r??partition de chaleur <br> -d??fauts : polluant, pas accessible ?? tous (zones rurales o?? les tuyaux ne passent pas toujours)";
                break;
            case "Bois":
                divCaract.innerHTML = " -qualit??s : peu co??teux, tr??s ??cologique <br> -d??fauts : encombrant (?? ??viter dans les maisons peu spacieuses), ??viter l???humidit?? sinon le bois chauffera mal";
                break;
            case "Solaire":
                divCaract.innerHTML = "-qualit??s : 100% renouvelable, peut aider sur l?????lectricit?? ??galement <br> -d??fauts : n??cessite presque toujours un syst??me d???appoint, investissement important ";
                break;
            /*case "Iso1":
                divCaract.innerHTML = "";
                break;
            case "Iso2":
                divCaract.innerHTML = "";
                break;
            case "Iso3":
                divCaract.innerHTML = "";
                break;
            case "Iso4":
                divCaract.innerHTML = "";
                break;*/
        }

    }