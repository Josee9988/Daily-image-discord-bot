import DatabaseController from "./db/database-controller";
import CommandsController from './commands/commands-controller';
import {Client, Message} from 'discord.js';

require('dotenv').config();

process.env.NODE_ENV = "production";

const databaseController = new DatabaseController();
const client: Client = new Client();
const botCommands = new CommandsController("!dimg", client, databaseController)

client.on('message', async (message: Message) => { // message listener
    await botCommands.messageHandler(message);
});

client.on('guildCreate', guild => { // when the bot joins a server
    databaseController.createServerEntity(guild.id)
        .then(() => guild.systemChannel.send("We have successfully created an entry point for your server."));
    guild.systemChannel.send("Thanks for inviting me to your awesome server💖, use **`!dimg help`** for more information :D.")
        .catch(() => console.log("Couldn't send welcome message."));

});

client.on("guildDelete", function (guild) { // when the bot leaves a server
    databaseController.deleteServerEntity(guild.id)
        .catch(r => console.error('We couldn\'t delete server entity, Error: ' + r));
});

client.on("ready", () => {
    client.user.setStatus("online").catch(r => console.error('We couldn\'t set bot status, Error: ' + r));
    client.user.setPresence({
        activity: {
            name: "!dimg help",
            type: 'COMPETING',
            url: 'https://github.com/Josee9988/Daily-image-discord-bot'
        }
    }).catch(r => console.error('We couldn\'t set bot presence, Error: ' + r));
})

client.login(process.env.DISCORDJS_BOT_TOKEN)
    .catch(r => console.error('CRITICAL ERROR: We couldn\'t login the bot, Error: ' + r));
