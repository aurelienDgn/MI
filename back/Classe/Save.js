class Save{

    constructor(){
        this.pseudo = "";
        this.nbLevel = 3;
        this.levelChecked = new Array(this.nbLevel);
        this.content = 0;
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

    setContent(c){
        this.content = c;
    }

    getContent(){
        return this.content;
    }


}
module.exports = Save;