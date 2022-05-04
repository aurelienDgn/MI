class Save{

    constructor(){
        this.pseudo = "";
        this.nbLevel = 3;
        this.levelChecked = new Array(this.nbLevel);
        
    }

    setPseudo(pseudo){
        this.pseudo = pseudo;
    }

    getPseudo(){
        return this.pseudo;
    }

    setTab(tab){
        console.log("Dans la classe :"+tab);
        for(let i=0;i<tab.length;i++){
            this.levelChecked[i] = tab[i];
        }
    }

    getTab(){
        return this.levelChecked;
    }

    initTab(){
        for(let i=0;i<this.nbLevel;i++){
            this.levelChecked[i] = 0;
        }
    }


}
module.exports = Save;