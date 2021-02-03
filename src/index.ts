require('dotenv').config();
import Commands from './commands';
import { Message } from 'discord.js';

import { Client } from 'discord.js';
const client = new Client();
const botCommands = new Commands("!dimg", client)

client.on('message', async (message: Message) => {
    await botCommands.messageHandler(message);
});



client.login(process.env.DISCORDJS_BOT_TOKEN);
