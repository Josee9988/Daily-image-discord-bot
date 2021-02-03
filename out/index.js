"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const commands = require("./commands");
const { Client } = require('discord.js');
const client = new Client();
const PREFIX = "!dimg";
client.on('message', (message) => {
    if (message.author.bot)
        return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length + 1)
            .split(/\s+/);
        console.log("CMD NAME:" + CMD_NAME);
        if (CMD_NAME === 'help') {
            console.log('a');
            commands.helpCommand(message);
        }
    }
});
client.login(process.env.DISCORDJS_BOT_TOKEN);
//# sourceMappingURL=index.js.map