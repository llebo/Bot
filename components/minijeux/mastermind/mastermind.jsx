const json = require('./messages');

const messageID = '414278585252052992';
let messageChannel;
let roundLeft;
let find = [];
let numRounds = 20;
let startBool = false;
let par = "\n";
let space = " ";
let text;
let tableau = [];

let resetTime = 10000;


function setChannel(channel) {
    messageChannel = channel;
    start()
}

function start() {
    if (!startBool) {
        startBool = true;
        find = [];
        tableau = [];
        roundLeft = numRounds;
        randomResult();
        setText();
    }
}

function end() {
    if (startBool) {
        startBool = false;
        setText();
    }
    setTimeout(function () {
        start();
    }, resetTime);
}

function randomResult() {
    find.push(Math.floor(Math.random() * 9));
    find.push(Math.floor(Math.random() * 9));
    find.push(Math.floor(Math.random() * 9));
    find.push(Math.floor(Math.random() * 9));
    console.log("[MM] Find: " + find);
}

function setText() {
    let partie;
    text = json.head;
    if (roundLeft !== numRounds) {
        for (let i = 0; i < tableau.length; i++) {
            text += json.start + tableau[i][0][0] + space + tableau[i][0][1] + space + tableau[i][0][2] + space + tableau[i][0][3] + json.middle;
            text += tableau[i][1][0] + space + tableau[i][1][1] + space + tableau[i][1][2] + space + tableau[i][1][3] + json.finish;
        }
    }

    if (roundLeft > 0) {
        for (let i = 1; i <= roundLeft; i++) {
            text += json.default;
        }
        text += json.end;
    }
    if (startBool) {
        partie = json.started;
        text += par + partie;

    }
    else {
        partie = json.ended;
        text += par + partie;
        end();
    }
    setMessage();
}

function prop(num1, num2, num3, num4) {
    let verif = [];
    roundLeft--;
    if (num1 !== find[0]) {
        if (num1 !== find[1]) {
            if (num1 !== find[2]) {
                if (num1 !== find[3]) {
                    verif.push("\u25CC");
                }
                else verif.push("\u25CB");
            }
            else verif.push("\u25CB");
        }
        else verif.push("\u25CB");
    }
    else verif.push("\u25CF");

    if (num2 !== find[1]) {
        if (num2 !== find[0] && num2 !== num1) {
            if (num2 !== find[2]) {
                if (num2 !== find[3]) {
                    verif.push("\u25CC");
                }
                else verif.push("\u25CB");
            }
            else verif.push("\u25CB");
        }
        else verif.push("\u25CB");
    }
    else verif.push("\u25CF");

    if (num3 !== find[2]) {
        if (num3 !== find[0] && num3 !== num1) {
            if (num3 !== find[1] && num3 !== num2) {
                if (num3 !== find[3]) {
                    verif.push("\u25CC");
                }
                else verif.push("\u25CB");
            }
            else verif.push("\u25CB");
        }
        else verif.push("\u25CB");
    }
    else verif.push("\u25CF");

    if (num4 !== find[3]) {
        if (num4 !== find[0] && num4 !== num1) {
            if (num4 !== find[1] && num4 !== num2) {
                if (num4 !== find[2] && num4 !== num3) {
                    verif.push("\u25CC");
                }
                else verif.push("\u25CB");
            }
            else verif.push("\u25CB");
        }
        else verif.push("\u25CB");
    }
    else verif.push("\u25CF");

    tableau.push([[num1, num2, num3, num4], verif]);
    if (num1 === find[0] && num2 === find[1] && num3 === find[2] && num4 === find[3]) {
        win = true;
        end();
    }
    setText();
}

/**
 * @return {boolean}
 */
function MMRange(num) {
    return !(num < 0 || num > 9);
}

function help(time) {
    messageChannel.send("```" + par + json.help + "```")
        .then(msg => {
            msg.delete(time);
        })
}

function setMessage() {
    messageChannel.fetchMessage(messageID)
        .then(msg => {
            msg.edit("```" + par + text + "```");
        });
}

module.exports = {
    start,
    setChannel,
    prop,
    end,
    help,
    MMRange,
};

//TODO Save Info when Bot closed