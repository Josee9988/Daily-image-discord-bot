require('dotenv').config();
var Client = require('discord.js').Client;
var client = new Client();
var PREFIX = "$";
client.on('message', function (message) {
    if (message.author.bot)
        return; //ignore bot messages
    if (message.content.startsWith(PREFIX)) {
        var _a = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/), CMD_NAME = _a[0], args = _a.slice(1);
        if (CMD_NAME === 'help') {
            message.channel.send('This is my help message.');
        }
    }
});
client.login(process.env.DISCORDJS_BOT_TOKEN);
