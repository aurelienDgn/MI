const fs = require('fs');


let tab = [
    {pseudo: "Lui", niveaux: [1,1,0]},
    {pseudo: "Moi", niveaux: [0,1,0] }
];

fs.writeFile("save.json", JSON.stringify(tab), function (err) {
    if(err) throw err;
    console.log('File update');
});