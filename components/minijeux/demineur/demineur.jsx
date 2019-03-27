const json = require('./messages');

const messageID = '409229404817063955';
let messageChannel;
const tableau = [["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"], ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]];
let ligne0, ligne1, ligne2, ligne3, ligne4, ligne5, ligne6, ligne7, ligne8, ligne9;
let numBomb;
let bombs = [];
let cases = [];
let par = "\n";
let started = false;
let win = false;
let endText;
let resetTime = 10000;

function setChannel(channel) {
    messageChannel = channel;
    start()

}

function start() {
    if (!started) {
        started = true;
        win = false;
        bombs = [];
        cases = [];
        endText = "";
        resetTableau();
        randomBomb();
        setText();
    }
}

function resetTableau() {
    for (let i = 0; i < tableau.length; i++) {
        for (let j = 0; j < tableau[i].length; j++) {
            tableau[i][j] = "#";
        }
    }
    setText();
}

function randomBomb() {
    numBomb = Math.floor((Math.random() * 11) + 10);
    for (let i = 0; i < numBomb; i++) {
        let col = Math.floor(Math.random() * 10);
        let lin = Math.floor(Math.random() * 10);
        !isItemInArray(bombs, [lin, col]) ? bombs.push([lin, col]) : i--;
    }
    /*
    console.log("[Demineur] Bombs:");
    console.log(bombs);
    */
}

function setText() {
    ligne0 = "| 0 | " + tableau[0][0] + "  " + tableau[0][1] + "  " + tableau[0][2] + "  " + tableau[0][3] + "  " + tableau[0][4] + "  " + tableau[0][5] + "  " + tableau[0][6] + "  " + tableau[0][7] + "  " + tableau[0][8] + "  " + tableau[0][9] + " |";
    ligne1 = "| 1 | " + tableau[1][0] + "  " + tableau[1][1] + "  " + tableau[1][2] + "  " + tableau[1][3] + "  " + tableau[1][4] + "  " + tableau[1][5] + "  " + tableau[1][6] + "  " + tableau[1][7] + "  " + tableau[1][8] + "  " + tableau[1][9] + " |";
    ligne2 = "| 2 | " + tableau[2][0] + "  " + tableau[2][1] + "  " + tableau[2][2] + "  " + tableau[2][3] + "  " + tableau[2][4] + "  " + tableau[2][5] + "  " + tableau[2][6] + "  " + tableau[2][7] + "  " + tableau[2][8] + "  " + tableau[2][9] + " |";
    ligne3 = "| 3 | " + tableau[3][0] + "  " + tableau[3][1] + "  " + tableau[3][2] + "  " + tableau[3][3] + "  " + tableau[3][4] + "  " + tableau[3][5] + "  " + tableau[3][6] + "  " + tableau[3][7] + "  " + tableau[3][8] + "  " + tableau[3][9] + " |";
    ligne4 = "| 4 | " + tableau[4][0] + "  " + tableau[4][1] + "  " + tableau[4][2] + "  " + tableau[4][3] + "  " + tableau[4][4] + "  " + tableau[4][5] + "  " + tableau[4][6] + "  " + tableau[4][7] + "  " + tableau[4][8] + "  " + tableau[4][9] + " |";
    ligne5 = "| 5 | " + tableau[5][0] + "  " + tableau[5][1] + "  " + tableau[5][2] + "  " + tableau[5][3] + "  " + tableau[5][4] + "  " + tableau[5][5] + "  " + tableau[5][6] + "  " + tableau[5][7] + "  " + tableau[5][8] + "  " + tableau[5][9] + " |";
    ligne6 = "| 6 | " + tableau[6][0] + "  " + tableau[6][1] + "  " + tableau[6][2] + "  " + tableau[6][3] + "  " + tableau[6][4] + "  " + tableau[6][5] + "  " + tableau[6][6] + "  " + tableau[6][7] + "  " + tableau[6][8] + "  " + tableau[6][9] + " |";
    ligne7 = "| 7 | " + tableau[7][0] + "  " + tableau[7][1] + "  " + tableau[7][2] + "  " + tableau[7][3] + "  " + tableau[7][4] + "  " + tableau[7][5] + "  " + tableau[7][6] + "  " + tableau[7][7] + "  " + tableau[7][8] + "  " + tableau[7][9] + " |";
    ligne8 = "| 8 | " + tableau[8][0] + "  " + tableau[8][1] + "  " + tableau[8][2] + "  " + tableau[8][3] + "  " + tableau[8][4] + "  " + tableau[8][5] + "  " + tableau[8][6] + "  " + tableau[8][7] + "  " + tableau[8][8] + "  " + tableau[8][9] + " |";
    ligne9 = "| 9 | " + tableau[9][0] + "  " + tableau[9][1] + "  " + tableau[9][2] + "  " + tableau[9][3] + "  " + tableau[9][4] + "  " + tableau[9][5] + "  " + tableau[9][6] + "  " + tableau[9][7] + "  " + tableau[9][8] + "  " + tableau[9][9] + " |";
    setMessage();
}

function setMessage() {
    let start;
    started ? start = json.started : start = json.ended;
    messageChannel.fetchMessage(messageID)
        .then(msg => {
            msg.edit("```" + par + json.title.toUpperCase() + par + json.tab0 + par + json.tab1 + par + json.tab2 + par
                + ligne0 + par + ligne1 + par + ligne2 + par + ligne3 + par + ligne4 + par + ligne5 + par + ligne6
                + par + ligne7 + par + ligne8 + par + ligne9 + par + json.tabEnd + par + json.bombs + numBomb + par + start + endText + "```");
        });
}

function verifPos(col, lin, p) {
    if (started) {
        col = convertCol(col);
        lin = parseInt(lin);
        //console.log("[Demineur] Col: " + col + " Lin: " + lin);
        let prop = [lin, col];
        if (p) {
            if (!isItemInArray(cases, prop)) {
                tableau[prop[0]][prop[1]] = "P";
                setText();
            }
        }
        else {
           isItemInArray(bombs, prop) ?
                end() :
                addPropToCase(prop);
        }
    }
    else {
        messageChannel.send(json.fini)
            .then(msg => {
                msg.delete(5000)
            })
    }

}

function addPropToCase(prop) {
    if (!isItemInArray(cases, prop)) {
        cases.push(prop);
        verifyNearby(prop);
        if (cases.length === (100 - numBomb)) {
            win = true;
            end();
        }
    }
}

function end() {
    if (started) {
        started = false;
        win ?
            endText = json.win :
            endText = json.lost;
        showBombs();
    }
    setTimeout(function () {
        start();
    }, resetTime);
}

function showBombs() {
    for (let i = 0; i < bombs.length; i++) {
        tableau[bombs[i][0]][bombs[i][1]] = "B";
    }
    setText();
}

function verifyNearby(prop) {
    let value = 0;
    let verif = [];
    let top, bot, left, right = false;
    if (prop[0] === 0) {
        top = true;
    }
    if (prop[0] === 9) {
        bot = true;
    }
    if (prop[1] === 0) {
        left = true;
    }
    if (prop[1] === 9) {
        right = true;
    }
    if (!top) {
        verif.push([prop[0] - 1, prop[1]]);

        if (!left)
            verif.push([prop[0] - 1, prop[1] - 1]);
        if (!right)
            verif.push([prop[0] - 1, prop[1] + 1]);
    }
    if (!bot) {
        verif.push([prop[0] + 1, prop[1]]);

        if (!left)
            verif.push([prop[0] + 1, prop[1] - 1]);
        if (!right)
            verif.push([prop[0] + 1, prop[1] + 1]);
    }

    if (!left)
        verif.push([prop[0], prop[1] - 1]);
    if (!right)
        verif.push([prop[0], prop[1] + 1]);

    for (let i = 0; i < verif.length; i++) {
        if (isItemInArray(bombs, verif[i]))
            value++;
    }
    tableau[prop[0]][prop[1]] = value;
    if (value === 0)
        for (let i = 0; i < verif.length; i++) {
            addPropToCase(verif[i])
        }
    setText();
}

function convertCol(col) {
    let newCol;
    switch (col) {
        case 'a':
            newCol = 0;
            break;
        case 'b':
            newCol = 1;
            break;
        case 'c':
            newCol = 2;
            break;
        case 'd':
            newCol = 3;
            break;
        case 'e':
            newCol = 4;
            break;
        case 'f':
            newCol = 5;
            break;
        case 'g':
            newCol = 6;
            break;
        case 'h':
            newCol = 7;
            break;
        case 'i':
            newCol = 8;
            break;
        case 'j':
            newCol = 9;
            break;
    }
    return newCol;
}

function isItemInArray(array, item) {
    for (let i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] === item[0] && array[i][1] === item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function help(time) {
    messageChannel.send("```" + par + json.help + "```")
        .then(msg => {
            msg.delete(time);
        })
}

module.exports = {
    setChannel,
    start,
    end,
    verifPos,
    help,
};

//TODO Timer per user
//TODO Save Info when Bot closed