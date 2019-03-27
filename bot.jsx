const Discord = require('discord.js');
const bot = new Discord.Client({autoReconnect: true});
const {spawn} = require('child_process');
const config = require("./components/bot/config.json");
const json = require("./components/bot/messages.json");
const role = require("./components/roles.json");
const channels = require("./components/channels.json");
const pendu = require('./components/minijeux/pendu/pendu.jsx');
const demineur = require('./components/minijeux/demineur/demineur.jsx');
const mastermind = require('./components/minijeux/mastermind/mastermind.jsx');
const quizz = require('./components/minijeux/quizz/quizz.jsx');
const sondage = require('./components/bot/sondages/sondages.jsx');
const twitch = require('./components/Twitch/twitch.jsx');
const logs = require('./components/bot/logs.jsx');

const prefix = config.prefix;

let test = false;
let logged = false;

function clearID(message, id) {
    message.channel.fetchMessages({limit: 100})
        .then(messages => {
            for (let i = 0; i < messages.array().length; i++) {
                /*
                console.log(" ");
                console.log(i);
                console.log("Message ID: " + messages.array()[i].id);
                console.log("Message Content: " + messages.array()[i].content);
                console.log("Pseudo ID: " + messages.array()[i].author.id);
                */
                if (messages.array()[i].author.id === id) {
                    let msgToSup = messages.array()[i].id;
                    message.channel.fetchMessage(msgToSup)
                        .then(msg => {
                            msg.delete();
                        }).catch(err => {
                        console.log('Error while doing Bulk Delete');
                        console.log(err);
                    });
                }
            }
        }).catch(err => {
        console.log('Error while doing Bulk Delete');
        console.log(err);
    });
}

bot.on("ready", () => {
    logged = true;
    if (!test) bot.user.setPresence({status: config.statut, game: {name: config.game, type: 0}});
    else bot.user.setPresence({status: config.statut, game: {name: config.testing, type: 0}});
    console.log("[Bot] Stnuop Bot, prêt à l'emploi");
    pendu.setChannel(bot.channels.get(channels.pendu.id));
    demineur.setChannel(bot.channels.get(channels.demineur.id));
    mastermind.setChannel(bot.channels.get(channels.mastermind.id));
    quizz.setChannel(bot.channels.get(channels.quizz.id));
    twitch.setChannel(bot.channels.get(channels.live.id)); //TODO channel #Test to #AnnonceLive
});


bot.on('message', function (message) {
        if (message.author.bot) return;
        //Devenir Membre
        if (message.channel.name === "devenir_membre") {
            if (message.content === json.regle) {
                if (message.member.roles.has(role.membre.id) ||
                    message.member.roles.has(role.habitue.id) ||
                    message.member.roles.has(role.modo.id) ||
                    message.member.roles.has(role.streamer.id) ||
                    message.member.roles.has(role.admin.id))
                    message.delete();
                else {
                    message.delete();
                    message.member.addRole(role.membre.id).catch(console.error);
                    message.author.send(json.welcome);
                    logs.newMembers(message.author.username);
                    //console.log("[Bot] Le nouveau membre " + message.member.username + " est passé Membre sur le Discord");
                }

            }
            else message.delete();
        }
        //Liens
        if (message.content.includes("http") || message.content.includes("www.")) {
            if (message.channel.name !== "partage") {
                if (message.member.roles.has(role.membre.id) || message.member.roles.has(role.habitue.id)) {
                    //console.log("[Bot] Lien supprimé de " + message.member.username + " du channel " + message.channel.name + ": " + message.content);
                    message.delete();
                    message.channel.send(json.lien)
                        .then(msg => {
                            msg.delete(10000)
                        });
                }
            }
        }

        if (message.content.startsWith(prefix)) {
            let args;
            if (
                message.channel.name === "videos" ||
                // message.channel.name === "test" ||
                message.channel.name === "lives" //||
            //message.content.slice(prefix.length).split(' ')[0] === "s" ||
            //message.content.slice(prefix.length).split(' ')[0] === "sondage"
            )
                args = message.content.slice(prefix.length).split(' ');
            else
                args = message.content.toLowerCase().slice(prefix.length).split(' ');
            switch (args[0]) {
                case 'command':
                case 'help':
                case 'h':
                    message.channel.send(json.help)
                        .then(msg => {
                            msg.delete(10000)
                        });
                    break;
                case 'llebo':
                case 'llebofrance':
                    message.channel.send(json.llebo);
                    break;
                case 'imtom':
                case 'imtomxd':
                    message.channel.send(json.imtom);
                    break;
                case 'sabo':
                case 'sabolimpyque':
                    message.channel.send(json.sabo);
                    break;
                case 'mrluffoux':
                case 'luffoux':
                    message.channel.send(json.luffoux);
                    break;
                case 'daoud':
                    message.channel.send(json.daoud);
                    break;
                case 'live':
                    if (message.channel.name === "lives") {
                        if (message.member.roles.has(role.admin.id)) {
                            let person;
                            switch (args[1]) {
                                case 'imtom':
                                    person = "ImtomXD";
                                    break;
                                case 'llebo':
                                    person = 'LleboFrance';
                                    break;
                            }
                            message.channel.send(json.live + person + json.live1 + args[2] + json.live2 + args[3]);
                        }
                    }
                    break;
                case 'b':
                case 'bot':
                    if (message.member.roles.has(role.admin.id)) {
                        switch (args[1]) {
                            case 'reset':
                            case 'r':
                                console.log("[Bot] Statut Reset");
                                bot.user.setPresence({status: config.statut, game: {name: config.game}});
                                break;
                            case 'delete':
                            case 'd':
                                console.log("[Bot] Statut Delete");
                                bot.user.setPresence({status: config.statut, game: {name: ""}});
                                break;
                            case 'change':
                            case 'c':
                                let statut = config.statut;
                                let game = config.game;
                                switch (args[2]) {
                                    case "s":
                                    case "statut":
                                        switch (message.content.slice(prefix.length).trim().split(/ +/g)[3]) {
                                            case "online":
                                            case "0":
                                                statut = "online";
                                                break;
                                            case 'invisible':
                                            case "offline":
                                            case "1":
                                                statut = "invisible";

                                                break;
                                            case 'idle':
                                            case "afk":
                                            case "2":
                                                statut = "idle";
                                                break;
                                            case "dnd":
                                            case "3":
                                                statut = "dnd";
                                                break;
                                        }
                                        break;
                                    case "g":
                                    case "game":
                                        game = message.content.slice(prefix.length).trim().split(/ +/g)[3];
                                        break;
                                }
                                console.log("[Bot] Statut: " + statut + " ; Game: " + game);
                                bot.user.setPresence({status: statut, game: {name: game, type: 0}});
                                break;
                            case 'stop':
                            case 's':
                                console.log('[Bot] Stop Bot');
                                message.delete();
                                bot.destroy().catch(console.error);
                                break;
                            case 'restart':
                                console.log('[Bot] Restart Bot');
                                pendu.stopPendu(message);
                                message.delete();
                                bot.destroy().catch(console.error);
                                spawn('node', ['bot.jsx'], {
                                    stdio: 'inherit',
                                    shell: true
                                });
                                break;
                            default:
                                message.channel.send(json.invalid)
                                    .then(msg => {
                                        msg.delete(5000)
                                    });
                                break;
                        }
                    }
                    else {
                        args[0] = "other";
                    }
                    break;
                case "clear":
                    if (message.member.roles.has(role.admin.id)) {
                        if (args[1] == null) {
                            message.channel.fetchMessages()
                                .then(messages => {
                                    message.channel.bulkDelete(messages, 50);
                                }).catch(err => {
                                console.log('Error while doing Bulk Delete');
                                console.log(err);
                            });
                        }
                        else {
                            if (!isNaN(parseInt(args[1]))) {
                                message.channel.fetchMessages()
                                    .then(() => {
                                        message.channel.bulkDelete(args[1], 50);
                                    }).catch(err => {
                                    console.log('Error while doing Bulk Delete');
                                    console.log(err);
                                });
                            }
                            else {
                                let pseudo = args[1].slice("@".length).replace(/^\D+/g, '').split(">");
                                clearID(message, pseudo[0]);
                            }
                        }
                    }
                    break;
                case 'p':
                case 'pendu':
                    if (message.channel.name === channels.pendu.name) {
                        switch (args[1]) {
                            case 's':
                            case 'start':
                                if (message.member.roles.has(role.admin.id))
                                    pendu.start();
                                break;
                            case 'e':
                            case 'end':
                                if (message.member.roles.has(role.admin.id))
                                    pendu.end();
                                break;
                            case 'l':
                            case 'lettre':
                                if (args[2].length === 1)
                                    pendu.lettreVerif(message, args[2]);
                                break;
                            case 'm':
                            case 'mot':
                                pendu.motVerif(message, args[2]);
                                break;
                            case 'h':
                                pendu.help(15000);
                                break;
                            case 'help':
                                args[2] != null ?
                                    parseInt(args[2]) <= 120 ?
                                        pendu.help(parseInt(args[2]) * 1000) :
                                        message.channel.send("Valeur de temps trop élevé ! MAX: 120")
                                            .then(msg => {
                                                msg.delete(5000)
                                            }) :
                                    pendu.help(15000);
                                break;
                            default:
                                message.channel.send(json.invalid)
                                    .then(msg => {
                                        msg.delete(5000)
                                    });
                                break;
                        }
                    }
                    break;
                case 'd':
                case 'demineur':
                    if (message.channel.name === channels.demineur.name) {
                        if (args[1] != null) {
                            if (args[2] != null && args[1].length === 1) {
                                if (args[2].length === 1) {
                                    if (args[3] == null || args[3] === "p") {
                                        let bool;
                                        args[3] === "p" ?
                                            bool = true :
                                            bool = false;
                                        isNaN(args[1]) && !isNaN(args[2]) ?
                                            demineur.verifPos(args[1], args[2], bool) :
                                            !isNaN(args[1]) && isNaN(args[2]) ?
                                                demineur.verifPos(args[2], args[1], bool) :
                                                message.channel.send("Position impossible!")
                                                    .then(msg => {
                                                        msg.delete(5000)
                                                    });
                                    }
                                    else {
                                        message.channel.send(json.invalid)
                                            .then(msg => {
                                                msg.delete(5000)
                                            });
                                    }
                                } else {
                                    message.channel.send(json.invalid)
                                        .then(msg => {
                                            msg.delete(5000)
                                        });
                                }
                            }
                            else {
                                switch (args[1]) {
                                    case 's':
                                    case 'start':
                                        if (message.member.roles.has(role.admin.id)) {
                                            demineur.start(message.channel);
                                        }
                                        break;
                                    case 'e':
                                    case 'end':
                                        if (message.member.roles.has(role.admin.id)) {
                                            demineur.end();
                                        }
                                        break;
                                    case 'h':
                                        demineur.help(15000);
                                        break;
                                    case 'help':
                                        args[2] != null ?
                                            parseInt(args[2]) <= 120 ?
                                                demineur.help(parseInt(args[2]) * 1000) :
                                                message.channel.send("Valeur de temps trop élevé ! MAX: 120")
                                                    .then(msg => {
                                                        msg.delete(5000)
                                                    }) :
                                            demineur.help(15000);
                                        break;
                                }
                            }
                        }
                    }
                    break;
                case 'm':
                case 'mastermind':
                    if (message.channel.name === channels.mastermind.name) {
                        if (isNaN(args[1]))
                            switch (args[1]) {
                                case 's':
                                case 'start':
                                    if (message.member.roles.has(role.admin.id)) {
                                        mastermind.start();
                                    }
                                    break;
                                case 'e':
                                case 'end':
                                    if (message.member.roles.has(role.admin.id)) {
                                        mastermind.end();
                                    }
                                    break;
                                case 'h':
                                case 'help':
                                    args[2] != null ?
                                        parseInt(args[2]) <= 120 ?
                                            mastermind.help(parseInt(args[2]) * 1000) :
                                            message.channel.send("Valeur de temps trop élevé ! MAX: 120")
                                                .then(msg => {
                                                    msg.delete(5000)
                                                }) :
                                        mastermind.help(15000);
                                    break;
                            }
                        else {
                            if (mastermind.MMRange(args[1]) && mastermind.MMRange(args[2]) && mastermind.MMRange(args[3]) && mastermind.MMRange(args[4]))
                                mastermind.prop(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), parseInt(args[4]));
                            else
                                message.channel.send("Valeur proposé invalide !")
                                    .then(msg => {
                                        msg.delete(5000);
                                    });
                        }
                    }
                    break;
                case 'quizz':
                case 'q':
                    if (message.channel.name === channels.quizz.name) {
                        if (isNaN(args[1]))
                            switch (args[1]) {
                                case 's':
                                case 'start':
                                    if (message.member.roles.has(role.admin.id)) {
                                        quizz.start();
                                    }
                                    break;
                                case 'e':
                                case 'end':
                                    if (message.member.roles.has(role.admin.id)) {
                                        quizz.end();
                                    }
                                    break;
                                case 'h':
                                case 'help':
                                    args[2] != null ?
                                        parseInt(args[2]) <= 120 ?
                                            quizz.help(parseInt(args[2]) * 1000) :
                                            message.channel.send("Valeur de temps trop élevé ! MAX: 120")
                                                .then(msg => {
                                                    msg.delete(5000)
                                                }) :
                                        quizz.help(15000);
                                    break;
                                default:
                                    message.channel.send("Valeur proposé invalide !")
                                        .then(msg => {
                                            msg.delete(5000);
                                        });
                                    break;
                            }
                        else {
                            if (quizz.quizzRange(args[1]))
                                quizz.verifReponse(parseInt(args[1]));
                            else
                                message.channel.send("Valeur proposé invalide !")
                                    .then(msg => {
                                        msg.delete(5000);
                                    });
                        }
                    }
                    break;
                case 's':
                case 'sondage':
                    if (message.member.roles.has(role.admin.id)) {
                        switch (args[1]) {
                            case 's':
                            case 'start':
                                let infos = message.content.slice(prefix.length + args[0] + " " + args[1]).split(" \"");
                                sondage.start(message.channel, infos);
                                break;
                            case 'e':
                            case 'end':
                                sondage.end();
                                break;
                        }
                    }
                    break;
                case 't':
                case 'twitch':
                    if (message.member.roles.has(role.admin.id)) {
                        let pseudo = args[1];
                        if (message.guild.roles.get(role.streamer.id).members.map(m => m.user.username.toLowerCase()).includes(pseudo)) {
                            twitch.sendMessage(pseudo)
                        }
                        else {
                            message.channel.send(pseudo + " n'est pas un Streamer!")
                                .then(msg => {
                                    msg.delete(5000)
                                });
                        }
                    }
                    break;
                case 'id':
                    if (message.member.roles.has(role.admin.id)) {
                        let role;
                        if (isNaN(args[1])) {
                            role = message.guild.roles.find("name", args[1]);
                        }
                        else {
                            role = message.guild.roles.find("id", args[1]);
                        }
                        console.log(role);
                    }
                    break;
                default:
                    message.channel.send(json.invalid)
                        .then(msg => {
                            msg.delete(5000)
                        });
                    break;

            }
            message.delete();
        }
        else {
            let channelName = message.channel.name;
            if (channelName === channels.pendu.name ||
                channelName === channels.demineur.name ||
                channelName === channels.quizz.name ||
                channelName === channels.mastermind.name
            ) {
                message.delete();
                message.channel.send(json.jeux)
                    .then(msg => {
                        msg.delete(5000)
                    });
            }
        }


        /*
        //Points
        if (!points[message.author.id]) points[message.author.id] = {
            points: 0,
            level: 0
        };
        let userData = points[message.author.id];
        userData.points++;

        let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
        if (curLevel > userData.level) {
            // Level up!
            userData.level = curLevel;
            message.author.send(json.levelup + curLevel + json.levelup1);
        }

        if (message.content.startsWith(prefix + "level")) {
            message.author.send(json.level + userData.level);
        }
        fs.writeFile("./points.json", JSON.stringify(points), (err) => {
            if (err) console.error(err)
        });*/


    }
);

bot.on('reconnacting', function () {
    console.log("[" + dateFormat(new Date(), "%d-%m-%Y %H:%M:%S", true) + "] Bot Reconnecting");
});

bot.on('error', function (error) {
    console.log("[" + dateFormat(new Date(), "%d-%m-%Y %H:%M:%S", true) + "] Bot Disconnected, trying again in few sec");
    setTimeout(function () {
        bot.destroy().catch(console.error);
        if (logged) {
            logged = false;
            spawn('node', ['bot.jsx'], {
                stdio: 'inherit',
                shell: true
            });
        }

    }, 50000)
});

bot.on("disconnected", function () {
    console.log("[Bot] Disconnected!");
    //process.exit(1);
});

//Start Bot
bot.login(config.token).catch(console.error);

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


//TODO Website