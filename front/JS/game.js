let valider = document.getElementById("good");

let niv1 = document.getElementById("niv1");
let niv2 = document.getElementById("niv2");
let niv3 = document.getElementById("niv3");

let tabDeNiveau = [niv1,niv2,niv3];
let newTab = new Array(tabDeNiveau.length);

//On demande la save
socket.emit('envoiMoiLeTab');

socket.on('merci', (tab) => {
    // On récupère la save au chargement de la page
    //console.log(tab);
    for(let i=0;i<tab.length;i++){
        if(tab[i] == 1){
            tabDeNiveau[i].checked = true;
        }
    }
});

valider.addEventListener('click', function () {
    // Lorsque l'on clique sur valider on mets à jour le tableau qu'on envoie au serveur
    for(let i=0;i<tabDeNiveau.length;i++){
        if(tabDeNiveau[i].checked){
            newTab[i] = 1;
        } else {
            newTab[i] = 0;
        }
    }

    socket.emit('tiensSave', (newTab));
});







// Initialisation de la barre

// Il faudra récupérer un json avec la liste des éléments

// le tableau sera récup de le json a terme

let tabElt = ["Murs", "Toit", "Sol", "Portes & fenêtres"];
let imgElt = ["../Image/walls.png", "../Image/toit.png", "../Image/floor.png", "../Image/door.png"];
let tabMatMurs = ["Bois", "Metal", "Aluminium"];
let imgMat = ["../Image/wood.png", "../Image/wood.png", "../Image/wood.png"];

let barre = document.getElementById("barre");

barreElt();

function barreMat(mat){

    while(barre.firstChild){
        barre.removeChild(barre.firstChild);
    }

    console.log(mat);
    switch (mat){
        case "Murs":
            matElt(tabMatMurs);
            break;
        case "Toit":
            break;
        case "Sol":
            break;
        case "Portes & fenêtres":
            break;
    }
}

function matElt(tabMat){
    
    for(let i=0;i<tabMat.length;i++){
        let div = document.createElement("div");
        div.id = "elt"+i;
        div.className = "elt";
    
        let img = document.createElement("img");
        img.src = imgMat[i];
        img.className = "img";
    
        let p = document.createElement("h4");
        p.className = "nameElt";
        p.innerText = tabMat[i];
    
        div.appendChild(img);
        div.appendChild(p);
    
        barre.appendChild(div);

        // Lance une animation de fondu 
        document.getElementById(div.id).animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: 1000
        })
    }
}

function barreElt(){

    while(barre.firstChild){
        barre.removeChild(barre.firstChild);
    }

    for(let i=0;i<tabElt.length;i++){
        let div = document.createElement("div");
        div.id = "elt"+i;
        div.className = "elt";

        div.addEventListener('click', function (){
            barreMat(tabElt[i]);
        });
    
        let img = document.createElement("img");
        img.src = imgElt[i];
        img.className = "img";
    
        let p = document.createElement("h4");
        p.className = "nameElt";
        p.innerText = tabElt[i];
    
        div.appendChild(img);
        div.appendChild(p);
    
        barre.appendChild(div);

        // Lance une animation de fondu 
        let d = document.getElementById("test");
        d.addEventListener('click', function(){
            myMove();
        });

        let ttt = document.getElementById("elt3");
        
        
    }

}














