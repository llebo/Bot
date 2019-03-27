const {spawn} = require('child_process');

const bot = spawn('node', ['bot.jsx'], {
    stdio: 'inherit',
    shell: true
});
/*
const dj = spawn('node', ['dj.jsx'], {
    stdio: 'inherit',
    shell: true
});
*/