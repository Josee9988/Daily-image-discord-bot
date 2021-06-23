import DatabaseController from "./db/database-controller";
import CommandsController from './commands/commands-controller';
import {Client, Guild, Message} from 'discord.js';
import {welcomeOwnerPrivatelyMessage} from "./commands/command-messages-data";

require('dotenv').config();

process.env.NODE_ENV = "production";

const databaseController = new DatabaseController();
const client: Client = new Client();
const botCommands = new CommandsController("!dimg", client, databaseController)

// Event listener message. When any message is sent, the bot will process it.
client.on('message', async (message: Message) => { // message listener
    await botCommands.messageHandler(message);
});

// event listener "guildCreate".
// It will create in the database a document with the server id.
client.on('guildCreate', (guild: Guild) => { // when the bot joins a server
    databaseController.createServerEntity(guild.id)
        .then(() => guild.systemChannel.send("We have successfully created an entry point for your server."));
    guild.systemChannel.send("Thanks for inviting me to your awesome server💖, use **`!dimg help`** for more information :D.")
        .catch(() => console.log("Couldn't send welcome message."));

    if (client.users.cache.get(guild.ownerID)) // When the bot is added to a new server, it will send a DM to the server owner.
        client.users.cache.get(guild.ownerID).send(welcomeOwnerPrivatelyMessage.msg)
            .catch((e: any) => console.error(('Couldn\'t send a welcome DM message to the owner, ERROR:' + e)));
});

// event listener "guildDelete".
// It will remove from the database all the data from the server if the bot got kicked out/leaves a server.
client.on("guildDelete", (guild: Guild) => { // when the bot leaves a server remove it's document
    databaseController.deleteServerEntity(guild.id)
        .catch((e: any) => console.error('We couldn\'t delete server entity, Error: ' + e));
});

// event listener "ready". It will set the bot status and bot presence.
client.on("ready", () => {
    client.user.setStatus("online").catch((e: any) => console.error('We couldn\'t set bot status, Error: ' + e));
    client.user.setPresence({
        activity: {
            name: "!dimg help",
            type: 'COMPETING',
            url: 'https://github.com/Josee9988/Daily-image-discord-bot'
        }
    }).catch((e: any) => console.error('We couldn\'t set bot presence, Error: ' + e));
})

// Authenticates the bot using the env variable "DISCORDJS_BOT_TOKEN", then the bot will be online and available
client.login(process.env.DISCORDJS_BOT_TOKEN)
    .catch((e: any) => console.error('CRITICAL ERROR: We couldn\'t login the bot, Error: ' + e));
