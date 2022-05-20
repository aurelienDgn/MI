class Maison {
    
    constructor(solde){
        this.mur = "Rien";
        this.sol = "Rien";
        this.toit = "Rien";
        this.chauffage = "Rien";
        this.isolant = "Rien";
        this.solde = solde;
    }

    setMur(elt){
        this.mur = elt;
    }

    getMur(){
        return this.mur;
    }

    setSol(elt){
        this.sol = elt;
    }

    getSol(){
        return this.sol;
    }

    setToit(elt){
        this.toit = elt;
    }

    getToit(){
        return this.toit;
    }

    setChauffage(elt){
        this.chauffage = elt;
    }

    getChauffage(){
        return this.chauffage;
    }

    setIsolant(elt){
        this.isolant = elt;
    }

    getIsolant(){
        return this.isolant;
    }

    setSolde(solde){
        this.solde = solde;
    }

    getSolde(){
        return this.solde;
    }

}