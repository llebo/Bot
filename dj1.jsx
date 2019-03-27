const Discord = require('discord.js');
const dj = new Discord.Client();
const yt = require('ytdl-core');
const config = require("./components/dj/config.json");

let server;
let test = false;
servers = {};

function play(connection) {
    console.log(server.queue[0]);
    //server.dispatcher = connection.playStream(yt(server.queue[0], {filter: "audioonly"}));
    server.dispatcher = connection.playStream(yt(server.queue[0]));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) {
            play(connection);
        }
        else connection.disconnect();
    });

}


dj.on("ready", () => {
    console.log("DJ: DJ Stnuop, prêt à mettre le feu à la piste de dance");
    if (!test) dj.user.setPresence({status: config.statut, game: {name: config.game, type: 0}});
    else dj.user.setPresence({status: config.statut, game: {name: config.testing, type: 0}});
});

dj.on('message', message => {
    if (message.content.startsWith(config.prefix)) {
        let args;
        args = message.content.slice(config.prefix.length).split(' ');
        switch (args[0]) {
            case 'play':
                if (!args[1]) {
                    message.channel.send("Please provide link");
                    return;
                }

                if (!message.member.voiceChannel) {
                    message.channel.send("You must be in a voice channel");
                }

                if (!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                };

                server = servers[message.guild.id];
                server.queue.push("https://www.youtube.com/watch?v=" + args[1]);
                //server.queue.push(args[1]);
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join().then(function (connection) {
                        //console.log(connection);
                        play(connection);
                    })
                }
                break;
            case 'skip':
                if (server.dispatcher) server.dispatcher.end();
                break;
            case 'stop':
                if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                break;
            default:
                break;
        }
    }

});

//Start Bot
dj.login(config.token).catch(console.error);