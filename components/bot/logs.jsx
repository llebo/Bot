const fs = require('fs');
const membres = './logs/membres.txt';
const pendu = './logs/pendu.txt';
const links = './logs/liens.txt';

function newMembers(username) {
    let time = dateFormat(new Date(), "%d-%m-%Y %H:%M:%S", true);
    let text = "[" + time + "] " + username + "\n";
    fs.appendFileSync(membres, text);
}

function penduWinner(username, mot) {
    let time = dateFormat(new Date(), "%d-%m-%Y %H:%M:%S", true);
    let text = "[" + time + "] " + username + " à trouvé le mot: + " + mot + "\n";
    fs.appendFileSync(pendu, text);
}

function liensSupp(message) {
    let username = message.channel.username;
    let channel = message.channel.name;
    let lien = message.content;
    let time = dateFormat(new Date(), "%d-%m-%Y %H:%M:%S", true);
    let text = "[" + time + "] Lien supprimé de " + username + " du channel " + channel + ": " + lien + "\n";
    fs.appendFileSync(links, text);
}

function dateFormat(date, fstr, utc) {
    utc = utc ? 'getUTC' : 'get';
    return fstr.replace(/%[YmdHMS]/g, function (m) {
        switch (m) {
            case '%Y':
                return date[utc + 'FullYear'](); // no leading zeros required
            case '%m':
                m = 1 + date[utc + 'Month']();
                break;
            case '%d':
                m = date[utc + 'Date']();
                break;
            case '%H':
                m = date[utc + 'Hours']();
                break;
            case '%M':
                m = date[utc + 'Minutes']();
                break;
            case '%S':
                m = date[utc + 'Seconds']();
                break;
            default:
                return m.slice(1); // unknown code, remove %
        }
        // add leading zero if required
        return ('0' + m).slice(-2);
    });
}

module.exports = {
    newMembers,
    penduWinner,
    liensSupp,
};