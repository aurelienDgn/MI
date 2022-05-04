// Récupération button/div et style visibility
let divCo = document.getElementById("co");
let newP = document.getElementById("newP");
newP.style.visibility = 'hidden';
let load = document.getElementById("load");
load.style.visibility = 'hidden';

// Variables 
let isGuest = false;

//Affiche le champ de texte pour écrire son pseudo et lancer le jeu
let co = document.getElementById("connect");
co.addEventListener('click', function(){
	isGuest = false;
	divCo.style.visibility = "visible";
	newP.style.visibility = 'hidden';
	load.style.visibility = 'hidden';
});

// On fait apparaitre les choix de faire charger ou nouvelle partie
let guest = document.getElementById("guest");
guest.addEventListener('click', function (){
	newP.style.visibility = 'visible';
	load.style.visibility = 'visible';
	divCo.style.visibility = "hidden";
	isGuest = true;
});


// Appelle getPseudo lorsque l'on clique sur valider
let validate = document.getElementById("enterCo");
validate.addEventListener("click", function(){
	newP.style.visibility = 'visible';
	load.style.visibility = 'visible';
	checkPseudo();
});


load.addEventListener('click', function(){
	
    // Vérifier si on a une partie d'enregistrer à ce compte/guest
    if(false){
        alert("Aucune partie n'a été commencé avec ce compte ;(");
    } else {
        // Lancer scène du jeu
    }
});

newP.addEventListener('click', function(){
    //Lancer scène du jeu en mode nouvelle partie
	console.log(getPseudo());
	socket.emit('connectPseudo', getPseudo());
});


// IL FAAUT REINITIALISER LA CLASSE (SCORE/PSEUDO) DANS LE SERVEUR QUAND ON REVIENT SUR LA PAGE DACCUEIL


// Récupère le pseudo et vérifie qu'il ne soit pas vide et fasse entre 3 et 12 caractères
function getPseudo(){
	let enterInput = document.getElementById("pseudoText");
	let enterCo = enterInput.value;
	
	if(isGuest){
		return "guest";
	} else{
		return enterCo;
	}
	
}

function checkPseudo(){
	let enterInput = document.getElementById("pseudoText");
	let enterCo = enterInput.value;

	if(enterCo == "" || enterCo.length > 12 || enterCo.length < 3 ){
		alert("Entrez un pseudo entre 3 et 12 caractères !!!!!!");
		document.getElementById("pseudoText").value = "";
	}
}
