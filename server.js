const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const fs = require('fs');

app.use(express.static(__dirname + '/front/'));

const session = require("express-session")({
    // CIR2-chat encode in sha256
    secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

var Save = require('./back/Classe/Save.js');

/**** Project configuration ****/

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Init of express, to point our assets
app.use(express.static(__dirname + '/front/'));
app.use(urlencodedParser);
app.use(session);

// Configure socket io with session middleware
io.use(sharedsession(session, {
    // Session automatiquement sauvegardée en cas de modification
    autoSave: true
}));

// Détection de si nous sommes en production, pour sécuriser en https
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    session.cookie.secure = true // serve secure cookies
}


var saveCl = new Save();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/html/index.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/front/html/game.html');
});

http.listen(8000, () => {

    fs.appendFile('save.json', '', function (err) {
        if (err) throw err;
        //console.log('Fichier créé !');
    });

    console.log("Server Started on the port 8000");
});

io.on('connection', (socket) => {

    socket.on('connectPseudo', function(pseudo){
        saveCl.setPseudo(pseudo);
        fs.readFile('save.json', 'utf8', function(err, data) {
            let content = data;
            content = JSON.parse(content);
            
            // On cherche si le pseudo a déjà une save
            for(let i=0;i<content.length;i++){
                if(content[i].pseudo == pseudo){
                    // Si oui en enregistre sa save
                    saveCl.setTab(content[i].niveaux);
                    console.log("La c'est charge : "+saveCl.getTab());
                }
            }

        });
    });

    socket.on('envoiMoiLeTab', function() {
        // On envoie le tableau au client
        console.log("envoie Tab : "+saveCl.getTab());
        socket.emit('merci', (saveCl.getTab())); 
    });

    socket.on('tiensSave', (tab) => {
        saveCl.setTab(tab);
        // sauvegarder dans json le nouveau tab au bon pseudo
        console.log(tab);
    });

});
