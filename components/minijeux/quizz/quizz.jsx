const messagesJOSN = require('./messages');
const JSONPath = require('advanced-json-path');
const fs = require('fs');
const readline = require('readline');
const logs = require('./../../bot/logs.jsx');
const liste = './components/minijeux/quizz/list/';

const messageID = "423831876936138752";
let messageChannel;
let startBool, winBool = false;
let rightAnswer;
let par = "\n";

let file;
let json;
let theme;
let quizzDificulty;
let modeString;
let modeNumber;
let questionID;
let questionPath;

let resetTime = 10000;

function start() {
    if (!startBool) {
        startBool = true;
        winBool = false;
        rightAnswer = "";
        setQuizz();
    }
}

function end() {
    if (startBool) {
        startBool = false;
        winBool = false;
        setMessage();
    }
    setTimeout(function () {
        start();
    }, resetTime);
}

function setQuizz() {
    file = chooseQuizzFile();
    json = require('./list/' + file);

    theme = json.thème;
    quizzDificulty = json.difficulté;
    modeNumber = Math.floor(Math.random() * 3);
    modeString = switchDificulty(modeNumber);
    let id = Math.floor(Math.random() * 10) + 1;
    questionID = (10 * modeNumber) + id;
    //console.log("Dif: " + modeString + " ID: " + questionID);
    questionPath = jsonPath(json, modeString, questionID);
    setMessage();
}

/**
 * @return {file}
 */
function chooseQuizzFile() {
    let number;
    let random;
    let files = fs.readdirSync(liste);

    number = files.length;
    random = Math.floor(Math.random() * number);
    //console.log(number);
    //console.log(files[random]);
    return files[random]
}

/**
 * @return {string}
 */
function switchDificulty(dif) {
    switch (dif) {
        case 0:
            return 'débutant';
        case 1:
            return 'confirmé';
        case 2:
            return 'expert';
    }
}

/**
 * @param json
 * @param dificulty
 * @param id
 * @return {*}
 */
function jsonPath(json, dificulty, id) {
    let jsonPath = JSONPath(json, '$..' + dificulty + '[?(@.id == ' + id + ')]');
    return jsonPath;
}

function verifReponse(reponse) {
    if (startBool) {
        startBool = false;
        questionPath.propositions[reponse - 1] === questionPath.réponse ? winBool = true : winBool = false;
        end();
        setMessage();
    }
}

/**
 * EditMessage on Discord Quizz Channel
 */
function setMessage() {
    let message = "```" + "Thème: " + theme + par + "Difficulté du Thème: " + quizzDificulty + par + par + "Mode de la Question: " + modeString.charAt(0).toUpperCase() + modeString.slice(1) + par + questionPath.question + par + "[1] " + questionPath.propositions[0] + par + "[2] " + questionPath.propositions[1] + par + "[3] " + questionPath.propositions[2] + par + "[4] " + questionPath.propositions[3] + par;
    if (!startBool) {
        message += par;
        if (winBool)
            message += "Bravo";
        else
            message += "Dommage";
        message += ", la réponse était: " + questionPath.réponse + par + "Anecdote: " + questionPath.anecdote + "```"
    }
    else
        message += "```";

    messageChannel.fetchMessage(messageID)
        .then(quizzMessage => {
            quizzMessage.edit(message);
        }).catch((err) => {
        console.error(err);
    });
}

function help(time) {
    messageChannel.send("```" + par + messagesJOSN.help + "```")
        .then(msg => {
            msg.delete(time);
        })
}

/**
 * @return {boolean}
 */
function quizzRange(num) {
    return !(num < 1 || num > 4);
}

function setChannel(channel) {
    messageChannel = channel;
    start();
}

module.exports = {
    setChannel,
    start,
    end,
    help,
    verifReponse,
    quizzRange,
};
