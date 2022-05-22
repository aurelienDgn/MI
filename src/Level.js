class Level{

    constructor(){
        this.level = -1;

        this.solde = 6500;

        this.tabMatMurs = ["parpaing", "brick", "bloc coffrant", "beton cellulaire"];
        this.prixM = [800,2000,4000,2800];
        this.tabMatToit = ["tuiles", "ardoise", "metal", "zinc"];
        this.prixT = [500,1000,700,900];
        this.tabMatSol = ["bois massif", "bois lamine", "moquette","vinyle","carrelage"];
        this.prixS = [1200,600,400,200,800];
        this.tabMatChauff = ["electricite", "gaz", "bois", "solaire"];
        this.prixC = [500,700,600,1300];
        //this.tabMatIso = ["Iso1", "Iso2", "Iso3", "Iso4"];

        // Plaine
        this.noteMur1 = [5,18,15,3];
        this.noteToit1 = [13,17,1,18];
        this.noteSol1 = [6,19,14,4,11];
        this.noteChauff1 = [14,15,14,15];

        //Désert
        this.noteMur2 = [7,9,13,19];
        this.noteToit2 = [18,10,4,9];
        this.noteSol2 = [11,14,3,1,18];
        this.noteChauff2 = [12,11,15,16];

        // Neige
        this.noteMur3 = [3,5,17,18];
        this.noteToit3 = [6,9,16,10];
        this.noteSol3 = [17,14,10,6,17];
        this.noteChauff3 = [16,12,15,11];
    }

    getSolde(){
        return this.solde;
    }

    setLevel(l){
        this.level = l;
    }

    getLevel(){
        return this.level;
    }

    getNoteMur(mur){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatMurs.length && cont){

            if(mur.toLowerCase() == this.tabMatMurs[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }
        
        switch(this.level){
            case 1:
                return this.noteMur1[i];
            case 2:
                return this.noteMur2[i];
            case 3:
                return this.noteMur3[i];
        }
    }

    getPrixMur(mur){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatMurs.length && cont){

            if(mur.toLowerCase() == this.tabMatMurs[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }

        return this.prixM[i];
    }

    getNoteSol(sol){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatSol.length && cont){

            if(sol.toLowerCase() == this.tabMatSol[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }
        
        switch(this.level){
            case 1:
                return this.noteSol1[i];
            case 2:
                return this.noteSol2[i];
            case 3:
                return this.noteSol3[i];
        }
    }

    getPrixSol(sol){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatMurs.length && cont){

            if(sol.toLowerCase() == this.tabMatSol[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }

        return this.prixS[i];
    }

    getNoteToit(toit){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatToit.length && cont){

            if(toit.toLowerCase() == this.tabMatToit[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }

        switch(this.level){
            case 1:
                return this.noteToit1[i];
            case 2:
                return this.noteToit2[i];
            case 3:
                return this.noteToit3[i];
        }
    }

    getPrixToit(toit){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatMurs.length && cont){

            if(toit.toLowerCase() == this.tabMatToit[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }

        return this.prixT[i];
    }

    getNoteChauff(chauff){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatChauff.length && cont){

            if(chauff.toLowerCase() == this.tabMatChauff[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }
        
        switch(this.level){
            case 1:
                return this.noteChauff1[i];
            case 2:
                return this.noteChauff2[i];
            case 3:
                return this.noteChauff3[i];
        }
    }

    getPrixChauff(chauff){
        let i = -1;
        let j=0;
        let cont = true;

        while(j<this.tabMatMurs.length && cont){

            if(chauff.toLowerCase() == this.tabMatChauff[j].toLowerCase()){
                i = j;
                cont =false;
            }
            j++;
        }

        return this.prixC[i];
    }


    niv(mur, sol, toit, chauff){
        
        if(mur == "Rien" || sol == "Rien" || toit == "Rien" || chauff == "Rien"){
            alert("Il vous manque des matériaux à sélectionner");
            return false;
        } else{

            let prixM = this.getPrixMur(mur);
            let prixS = this.getPrixSol(sol);
            let prixT = this.getPrixToit(toit);
            let prixC = this.getPrixChauff(chauff);

            let pay =  prixC+prixM+prixS+prixT;

            if((this.solde-pay) < 0){
                alert("Vous n'avez pas assez d'argent pour cela, car cela coûte : "+pay);
                return false;
            } else{

                let noteM = this.getNoteMur(mur);
                let noteS = this.getNoteSol(sol);
                let noteT = this.getNoteToit(toit);
                let noteC = this.getNoteChauff(chauff);
        
                let final = (noteM+noteS+noteT+noteC)*0.25;
        
                alert("Votre score : "+final+" /20");
                return true;
            }


        }


    }
}