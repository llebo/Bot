const Discord = require('discord.js');
const yt = require('ytdl-core');
const fs = require('fs-utils');
const now = require('performance-now');
const {token, yt_token, name, oauth, prefix, passes} = require("./components/dj/config.json");
const YouTube = require('youtube-node');
const youTube = new YouTube();
youTube.setKey(yt_token);
const dj = new Discord.Client({fetchAllMembers: true});
const userData = JSON.parse(fs.readFileSync('./components/dj/songs.json'));
const msg = require("./components/dj/messages.json");
const role = require("./components/roles.json");
let song = false;
let dispatcher;

let queue = {};
const commands = {
    'play': (message) => {
        //if (userData['playlist'] === undefined) return message.reply("You don't have any songs in your playlist! Add some with `" + prefix + "add`");
        if (userData['playlist'] === undefined) return console.log("You don't have any songs in your playlist! Add some with `" + prefix + "add`");
        if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message));


        (function play(song) {
//            if (song === undefined) return message.channel.sendMessage("You don't have any songs in your playlist! Add some with `" + prefix + "add`").then(() => {
            if (song === undefined) return console.log("You don't have any songs in your playlist! Add some with `" + prefix + "add`").then(() => {
                message.member.voiceChannel.leave();
            });
            console.log(`Playing: **${song.title}**`);
            dispatcher = message.guild.voiceConnection.playStream(yt(song.url, {
                audioonly: true
            }) , { passes : passes });
            dispatcher.setVolume(0.05);
            let addvalue;
            console.log(dispatcher.volume * 1000);
            let collector = message.channel.createCollector(m => m);
            collector.on('message', m => {
                if (m.content.startsWith(prefix + 'pause')) {
                    dispatcher.pause();
                } else if (m.content.startsWith(prefix + 'resume')) {
                    dispatcher.resume();
                } else if (m.content.startsWith(prefix + 'skip')) {
                    console.log(':arrow_forward: Skipped.').then(() => {
                        dispatcher.end();
                    });
                } else if (m.content.startsWith(prefix + 'stop')) {
                    console.log('Music Stopped').then(() => {
                        collector.stop();
                    });
                } else if (m.content.startsWith(prefix + 'volume+')) {
                    if (m.content.split('+')[1] === '') {
                        addvalue = 10;
                    } else addvalue = parseInt(m.content.split('+')[1]);
                    if (Math.round(dispatcher.volume * 1000 + addvalue) >= 100) {
                        dispatcher.setVolume(0.1);
                        console.log(`DJ: Volume: ${Math.round(dispatcher.volume * 1000)}%`);
                    } else {
                        dispatcher.setVolume(Math.min((dispatcher.volume * 1000 + addvalue) / 1000, 0.1));
                        console.log(`DJ: Volume: ${Math.round(dispatcher.volume * 1000)}%`);
                    }
                } else if (m.content.startsWith(prefix + 'volume-')) {
                    if (m.content.split('-')[1] === '') {
                        addvalue = 10;
                    } else addvalue = parseInt(m.content.split('-')[1]);
                    if (Math.round(dispatcher.volume * 1000 - addvalue) <= 0) {
                        console.log(`DJ: Volume: ${Math.round(dispatcher.volume * 1000)}%`);
                    } else {
                        dispatcher.setVolume(Math.max((dispatcher.volume * 1000 - addvalue) / 1000, 0));
                        console.log(`DJ: Volume: ${Math.round(dispatcher.volume * 1000)}%`);
                    }
                }
                m.delete();
            });
            dispatcher.on('end', () => {
                collector.stop();
                play(userData['playlist'].songs[Math.floor(Math.random() * userData['playlist'].songs.length)]);
            });
            dispatcher.on('error', (err) => {
                return console.log('error: ' + err).then(() => {
                    collector.stop();
                    play(userData['playlist'].songs[Math.floor(Math.random() * userData['playlist'].songs.length)]);
                });
            });
        })(userData['playlist'].songs[Math.floor(Math.random() * userData['playlist'].songs.length)]);
        message.delete();
    },
    'join': (message) => {
        return new Promise((resolve, reject) => {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply(':no_entry_sign: I couldn\'t connect to your voice channel.');
            voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
            console.log(":white_check_mark: I've successfully joined your voice channel.");
            //console.log(":white_check_mark: I've successfully joined your voice channel.");
            message.delete();
        });
    },
    'add': (message) => {
        if (message.member.roles.has(role.adminID)) {
            function addFromUrl(url) {
                console.log("DJ: Adding music to playlist");
                if (url === '' || url === undefined) return console.log(`DJ: You must add a YouTube video url after ${prefix}add`);
                yt.getInfo(url, (err, info) => {
                    if (err) return console.log('DJ: Invalid YouTube Link: ' + err);
                    if (!userData['playlist']) userData['playlist'] = {
                        songs: []
                    };
                    userData['playlist'].songs.push({
                        url: url,
                        title: info.title
                    });
                    let updateValue = JSON.stringify(userData, null, 2);
                    fs.writeFileSync('./components/dj/songs.json', updateValue);
                    console.log(`DJ: Added **${info.title}** to your playlist.`);
                });
            }

            function addFromQuery(query) {
                youTube.search(query, 2, (err, result) => {
                    if (err) return; //console.log(`DJ: **Error:**\n${error}`);
                    let url = `https://www.youtube.com/watch?v=${result.items[0]["id"].videoId}`;
                    addFromUrl(url);
                });
            }

            if (message.content === prefix + "add") return;
            let url = message.content.split(' ')[1];
            if (url.includes("https://youtube.com/playlist") || url.includes("https://www.youtube.com/playlist") || url.includes("http://youtube.com/playlist") || url.includes("http://www.youtube.com/playlist")) return console.log(":no_entry_sign: You can't add a Youtube playlist a song.");
            if (url.includes("https://youtube.com/watch") || url.includes("https://www.youtube.com/watch") || url.includes("http://youtube.com/watch") || url.includes("http://www.youtube.com/watch") || url.includes("https://youtu.be/") || url.includes("https://www.youtu.be/") || url.includes("http://youtu.be/") || url.includes("http://www.youtu.be/")) {
                addFromUrl(url);
            } else {
                let query = message.content.replace(prefix + 'add', '');
                addFromQuery(query);
            }
        }
        message.delete();
    },
    'dj': (message) => {
        message.channel.send(msg.help);
        message.delete();
    },
    'djhelp': (message) => {
        message.channel.send(msg.help);
        message.delete();
    },
    'stats': (message) => {
        let start = now();
        let embed = new Discord.RichEmbed();
        console.log("```+ Fetching...```")
            .then(message => {
                let end = now();
                let milliseconds = parseInt((client.uptime % 1000) / 100),
                    seconds = parseInt((client.uptime / 1000) % 60),
                    minutes = parseInt((client.uptime / (1000 * 60)) % 60),
                    hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);
                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;
                let uptime = "" + hours + " hours, " + minutes + " minutes and " + seconds + "." + milliseconds + " seconds";
                embed.setColor(0x00FFE1)
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setTitle("Spotify Stats:")
                    .addField('• Uptime: ', `${uptime}`, true)
                    .addField('• Servers: ', `${client.guilds.size}`, true)
                    .addField('• Channels: ', `${client.channels.size.toLocaleString()}`, true)
                    .addField('• Users: ', `${client.users.size.toLocaleString()}`, true)
                    .addField('• Ping: ', `${(end - start).toFixed(0)} MS`, true)
                    .addField('• CPU Speed: ', '2.4GHz', true)
                    .addField(`• Mem. Usage: `, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
                console.log(embed);
                return console.log('```Done!```');
            }).catch(e => {
            //msg.channel.sendMessage(":no_entry_sign: There was an error! Report this please:\n\n" + e);
        });
        message.delete();
    }
};


dj.on("ready", () => {
    console.log("DJ: DJ Stnuop, prêt à mettre le feu à la piste de dance");
    client.user.setGame('DJ Stnuop Party');
});

dj.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return;
    if (commands.hasOwnProperty(msg.content.slice(prefix.length).split(' ')[0])) commands[msg.content.slice(prefix.length).split(' ')[0]](msg);
});


//Start Bot
dj.login(token).catch(console.error);
