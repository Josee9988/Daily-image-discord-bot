require('dotenv').config();
import CommandsController from './commands/commands-controller';
import {Client, Message} from 'discord.js';

const client = new Client();
const botCommands = new CommandsController("!dimg", client)

client.on('message', async (message: Message) => {
    await botCommands.messageHandler(message);
});



client.login(process.env.DISCORDJS_BOT_TOKEN);
