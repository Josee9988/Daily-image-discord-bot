require('dotenv').config();
import Commands from './commands';

const {Client} = require('discord.js');
const client = new Client();
const botCommands = new Commands("!dimg", client)

client.on('message', (message: any) => {
    botCommands.messageHandler(message);
});



client.login(process.env.DISCORDJS_BOT_TOKEN);