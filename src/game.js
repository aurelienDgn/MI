


// Initialisation de la barre

// Il faudra récupérer un json avec la liste des éléments

// le tableau sera récup de le json a terme

let tabElt = ["Murs", "Toit", "Sol", "Portes & fenêtres"];
let imgElt = ["Image/walls.png", "Image/toit.png", "Image/floor.png", "Image/door.png"];

// Tableaux des éléments à modifier
let tabMatMurs = ["Retour","Bois", "Metal", "Aluminium"];
let tabMatToit = ["Retour","Bois", "Metal", "Aluminium"];
let tabMatSol = ["Retour","Bois", "Metal", "Aluminium"];
let tabMatPF = ["Retour","Bois", "Metal", "Aluminium"];

// Tableaux des images des matériaux des différents éléments
let imgMatMurs = ["Image/croix.png","Image/wood.png", "Image/wood.png", "Image/wood.png"];
let imgMatToit = ["Image/croix.png","Image/wood.png", "Image/wood.png", "Image/wood.png"];
let imgMatSol = ["Image/croix.png","Image/wood.png", "Image/wood.png", "Image/wood.png"];
let imgMatPF = ["Image/croix.png","Image/wood.png", "Image/wood.png", "Image/wood.png"];

let barre = document.getElementById("barre");

barreElt();

function barreMat(mat){
    // Fonction affichant les différents matériaux d'un élément de la maison que l'on peut modifier
    while(barre.firstChild){
        // On supprime tout les enfants de la div barre
        barre.removeChild(barre.firstChild);
    }

    // En fonction de l'élément passer en paramètre on appelle la fonction correspondante qui va afficher les matériaux disponibles
    switch (mat){
        case "Murs":
            matElt(tabMatMurs, imgMatMurs, "murs");
            break;
        case "Toit":
            matElt(tabMatToit, imgMatToit, "toit");
            break;
        case "Sol":
            matElt(tabMatSol, imgMatSol, "sol");
            break;
        case "Portes & fenêtres":
            matElt(tabMatPF, imgMatPF, "pf");
            break;
    }
}

function matElt(tabMat, imgTab, elt){
    // Fonction qui affiche les matériaux dispo en fct de l'élément passé en param
    
    for(let i=0;i<tabMat.length;i++){
        // Création des div 
        let div = document.createElement("div");
        div.id = "elt"+i;
        div.className = "elt";
    
        // Création de l'image
        let img = document.createElement("img");
        img.src = imgTab[i];
        img.className = "img";
    
        // Création du text
        let p = document.createElement("h4");
        p.className = "nameElt";
        p.innerText = tabMat[i];
    
        // On ajoute texte et image à la div
        div.appendChild(img);
        div.appendChild(p);
    
        // Et la div à la barre
        barre.appendChild(div);

        div.addEventListener('click', function(){
            // Sélectionne le matériaux cliqué avec l'elt
            selecElt(elt, tabMat[i]);
        });

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
    // Créer les éléments que l'on pourra modifier

    // On enlève ce que contient la barre (au cas ou ou non)
    while(barre.firstChild){
        barre.removeChild(barre.firstChild);
    }

    for(let i=0;i<tabElt.length;i++){
        // Création de la div
        let div = document.createElement("div");
        div.id = "elt"+i;
        div.className = "elt";


        div.addEventListener('click', function (){
            // Lorsque l'on clique sur un élément ça appelle la fct qui montre les matériaux avec en parametre l'elt cliqué
            barreMat(tabElt[i]);
        });
    
        // Création de l'img
        let img = document.createElement("img");
        img.src = imgElt[i];
        img.className = "img";
    
        // Création du texte
        let p = document.createElement("h4");
        p.className = "nameElt";
        p.innerText = tabElt[i];
    
        // Ajoute tout ça dans la div
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
    console.log(elt+", "+mat);

    switch(mat){
        case "Retour":
            barreElt();
            break;
        
    }
}