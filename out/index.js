"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const commands_1 = require("./commands");
const { Client } = require('discord.js');
const client = new Client();
const botCommands = new commands_1.default("!dimg", client);
client.on('message', (message) => {
    botCommands.messageHandler(message);
});
client.login(process.env.DISCORDJS_BOT_TOKEN);
//# sourceMappingURL=index.js.map