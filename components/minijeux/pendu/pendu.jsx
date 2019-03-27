const json = require('./messages');
const save = require('./save');
const fs = require('fs');
const readline = require('readline');
const logs = require('./../../bot/logs.jsx');
const listMots = './components/minijeux/pendu/listMots.txt';

const messageID = "408827405973848085";
let messageChannel;
let startBool = false;
let word = "";
let find = [];
let utilise = [];
let lettres = [];
let tentative = 7;
let image;
let winBool = false;
let messageMotText = "a";
let messageTentativeText = "b";
let messageLettreText = json.lettres;
let messageTitleText = json.ended;

let pool = [];
let resetTime = 10000;


function start() {
    if (!startBool) {
        startBool = true;
        winBool = false;
        tentative = 7;
        lettres.length = 0;
        word = "";
        find = [];
        utilise = [];
        lettres = [];

        word = pool[Math.floor(Math.random() * pool.length)];
        for (let i = 0; i < word.length; i++) {
            lettres.push(word.charAt(i));
            find.push("_ ");
        }

        console.log("[Pendu] Mot: " + word);

        image = json.pendu0;
        messageTitleText = json.started;

        penduMessage();
        /*
        channel.send(json.ended + "\n\n" + json.pendu0 + "\n\n" + messageMotText + "\n" + messageLettreText + "\n\n" + messageTentativeText);
         */
    }
}

function end() {
    if (startBool) {
        startBool = false;
        messageTitleText = json.ended;
        penduMessage();
    }
    setTimeout(function () {
        start();
    }, resetTime);
}

function lettreVerif(message, lettre) {
    if (startBool) {
        //console.log("[Pendu] Lettre: " + lettre.toUpperCase() + " par " + message.author.username);
        let verif = false;
        let found = -1;
        do {
            found = lettres.indexOf(lettre);

            if (found >= 0) {
                find[found] = lettre + " ";

                lettres[found] = " ";
                if (!verif)
                    verif = true;
            }
        } while (found >= 0);

        //If lettre not found
        if (!verif) {
            if (utilise.indexOf(lettre) < 0) {
                tentative--;
                utilise.push(lettre);

            }
            image = penduImageCallback();
        }

        penduMessage();

        if (tentative === 0) {
            end();
        }
    }
}

function motVerif(message, mot) {
    if (startBool) {
        //console.log("[Pendu] Mot: " + mot + " par " + message.author.username);
        if (mot === word.toLowerCase()) {
            logs.penduWinner(message.author.username, word);
            winBool = true;
            end();
        }
        else {
            if (utilise.indexOf(mot) < 0) {
                tentative--;
                utilise.push(mot);
            }
            image = penduImageCallback();

        }
        penduMessage();

        if (tentative === 0) {
            end();
        }
    }
}

function penduImageCallback() {
    let image;
    switch (tentative) {
        case 0:
            image = json.pendu7;
            break;
        case 1:
            image = json.pendu6;
            break;
        case 2:
            image = json.pendu5;
            break;
        case 3:
            image = json.pendu4;
            break;
        case 4:
            image = json.pendu3;
            break;
        case 5:
            image = json.pendu2;
            break;
        case 6:
            image = json.pendu1;
            break;
    }
    return image;
}

function penduMessage() {
    let lettreUtil = "";
    let tent = "";
    tentative === 1 ? tent = " tentative." : tent = " tentatives.";

    messageTentativeText = "Il vous reste: " + tentative + tent;
    if (startBool) {
        let penduFindWord = "";
        for (let i = 0; i < word.length; i++) {
            penduFindWord = penduFindWord + find[i].toUpperCase();
        }
        messageMotText = json.find + penduFindWord;
    }
    else {
        if (winBool) {
            messageMotText = json.win + word.toUpperCase();
            messageTentativeText = "Bravo! Vous aviez encore " + tentative + tent;
        }
        else
            messageMotText = json.lost + word.toUpperCase();
    }

    if (utilise.length > 0)
        for (let i = 0; i < utilise.length; i++) {
            lettreUtil = lettreUtil + utilise[i].toUpperCase() + " ";
        }
    messageLettreText = json.lettres + lettreUtil;
    messageChannel.fetchMessage(messageID)
        .then(penduMessage => {
            penduMessage.edit("```" + messageTitleText + "\n\n" + image + "\n\n" + messageMotText + "\n" + messageLettreText + "\n\n" + messageTentativeText + "```");
        }).catch((err) => {
        console.error(err);
    });
    //saveJSON();
}

function saveJSON() {
    if (startBool) {
        save.started = true;
        save.find = find;
        save.lettre = lettres;
        save.word = JSON.stringify(word);
        save.tentative = tentative;
        save.utilises = utilise;
    }
    else {
        save.started = false;
    }
}

function setChannel(channel) {
    messageChannel = channel;
    createArray();
}

function createArray() {
    readline.createInterface({
        input: fs.createReadStream(listMots),
        terminal: false
    }).on('line', function (line) {
        pool.push(line);
    });
    setTimeout(function () {
        start()
    }, 1000);
}

function help(time) {
    messageChannel.send("```\n" + json.help + "```")
        .then(msg => {
            msg.delete(time);
        })
}

module.exports = {
    start,
    end,
    lettreVerif,
    motVerif,
    setChannel,
    help,
};


//TODO Timer per user
//TODO Check Winner
//TODO Winner getStream new game with custom word
//TODO Save Info when Bot closed