import DatabaseController from "./db/database-controller";
import CommandsController from './commands/commands-controller';
import {Client, Message} from 'discord.js';

require('dotenv').config();

const databaseController = new DatabaseController();
const client = new Client();
const botCommands = new CommandsController("!dimg", client, databaseController)

client.on('message', async (message: Message) => { // message listener
    await botCommands.messageHandler(message);
});


client.on('guildCreate', guild => { // when the bot joins a server
    guild.systemChannel.send("Thanks for inviting me to your awesome server💖, use **`!dimg help`** for more information :D.")
    databaseController.createServerEntity(guild.id)
        .then(() => guild.systemChannel.send("We have successfully created an entry point for your server."));
});

client.on("guildDelete", function (guild) { // when the bot leaves a server
    databaseController.deleteServerEntity(guild.id);
});

client.on("ready", () => {
    client.user.setStatus("online");
    client.user.setPresence({
        activity: {
            name: "!dimg help",
            type: 'COMPETING',
            url: 'https://github.com/Josee9988/Daily-image-discord-bot'
        }
    })
})

client.login(process.env.DISCORDJS_BOT_TOKEN);
