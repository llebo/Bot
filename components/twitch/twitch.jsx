const Discord = require('discord.js');

const config = require('./config');
const https = require("https");
const url = "https://api.twitch.tv/kraken/streams/teamstnuop";
const urlUser = "https://api.twitch.tv/kraken/users?login=teamstnuop";
const api = require("twitch-api-v5");
const TwitchApi = require("twitch-api");

const twitch = new TwitchApi({
    clientId: config.clientID,
    clientSecret: config.token,
    redirectUri: config.url,
    scopes: 'user_read'
});

api.clientID = config.clientID;
let notifiedBool = false;
let messageChannel; //TODO modify to LiveChannel

function getUser(user) {
    twitch.getUser(user, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
            /* Example response
            {
                display_name: 'Twitch',
                _id: '12826',
                name: 'twitch',
                type: 'user',
                ...
            }
            */
        }
    });
}

function getStream(streamer) {
    api.streams.channel({channelID: config.id}, (err, res) => {
        if (res.stream === null) {
            if (notifiedBool)
                notifiedBool = false;
            //console.log("Live déconnecté");
        }
        else {
            if (!notifiedBool) {
                //notifiedBool = true;
                //console.log(res);
                let url = res.stream.channel.url;
                let game = res.stream.game;
                let preview = res.stream.preview.large;
                let status = res.stream.channel.status;

                let embed = new Discord.RichEmbed()
                    //.setImage(preview)
                    .setTitle(streamer + " a lancé un live")
                    .addField("Titre du live", status)
                    .addField("Jeu", game)
                    .addField("Lien", url)
                    .setColor("PURPLE")
                    .setFooter("Rejoignez-nous en cliquant sur le lien")
                    .setURL(url);

                messageChannel.send(embed);
            }
        }
    });
}

function sendMessage(streamer) {
    getStream(streamer);
}

function setChannel(channel) {
    messageChannel = channel;
}

module.exports = {
    getUser,
    getStream,
    setChannel,
    sendMessage,
};