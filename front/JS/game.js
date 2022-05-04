let valider = document.getElementById("good");

let niv1 = document.getElementById("niv1");
let niv2 = document.getElementById("niv2");
let niv3 = document.getElementById("niv3");

let tabDeNiveau = [niv1,niv2,niv3];
let newTab = new Array(tabDeNiveau.length);

socket.emit('envoiMoiLeTab');

socket.on('merci', (tab) => {
    console.log(tab);
    for(let i=0;i<tab.length;i++){
        if(tab[i] == 1){
            tabDeNiveau[i].checked = true;
        }
    }
});

valider.addEventListener('click', function () {
    
    for(let i=0;i<tabDeNiveau.length;i++){
        if(tabDeNiveau[i].checked){
            newTab[i] = 1;
        } else {
            newTab[i] = 0;
        }
    }

    socket.emit('tiensSave', (newTab));
});
