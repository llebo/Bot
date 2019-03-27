const fs = require('fs');

const json = "./components/bot/sondages/history.json";
const infos = "./components/bot/sondages/infos.json";
const fileJson = require("./history.json");
const fileInfos = require("./infos.json");
let messageChannel;

function start(channel, infos) {
    let newID;
    let obj = "";
    let question;
    let answers = [];
    messageChannel = channel;
    let data = JSON.parse(fs.readFileSync(json, 'utf8'));
    obj += JSON.stringify(data).slice(0, -1) + ",";

    question = infos[1].split("\"")[0];
    for (let i = 2; i < infos.length; i++) {
        //console.log("ans: ", infos[i].split("\"")[0]);
        answers.push(infos[i].split("\"")[0])
    }
    let structure = '"' + fileConfig.id + '": {"channel": "' + channel + '", "active": true, "question": "' + question + '", "answers": {';
    for (let i = 1; i <= answers.length; i++) {
        structure += '"' + i + '": "' + answers[i - 1] + '"';
        if (i !== answers.length)
            structure += ','
    }
    structure += '}}}';

    obj += structure;

    fs.writeFileSync(json, obj, 'utf8');
    newID = fileConfig.id + 1;
    //console.log(fileConfig.id, newID);

    fileConfig.id = newID;

    fs.writeFileSync(config, JSON.stringify(fileConfig));
}

function end() {

}


module.exports = {
    start,
    end,
};