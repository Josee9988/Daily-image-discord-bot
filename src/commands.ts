import * as GooglePhotosAlbum from 'google-photos-album-image-url-fetch';
import {ImageInfo} from "google-photos-album-image-url-fetch/dist/imageInfo";
import {Message} from "discord.js";

export default class Commands {
    private albumLink: string;
    private channelToSpeakIn: string;

    constructor(private PREFIX: string, private client: any) {
        this.channelToSpeakIn = undefined;
    }

    async messageHandler(message: Message) {
        if (message.author.bot) return; //ignores bot messages
        if (message.content.startsWith(this.PREFIX)) {
            const [CMD_NAME, ...args] = message.content
                .trim()
                .substring(this.PREFIX.length + 1)
                .split(/\s+/);

            switch (CMD_NAME.toLocaleLowerCase()) {
                case "albumlink":
                    await this.setAlbumLink(message, args);
                    break;
                case "channel":
                    await this.setChannel(message, args);
                    break;
                case "help":
                    this.helpCommand(message);
                    break;
                case "info":
                    this.infoCommand(message);
                    break;
                case "ping":
                    this.pingCommand(message);
                    break;
                case "pong":
                    this.pongCommand(message);
                    break;
                default:
                    this.unknownCommand(message);
            }
        }
    }

    private pingCommand(message: any) {
        message.channel.send(`🏓Latency is **${Date.now() - message.createdTimestamp}**ms. API Latency is **${Math.round(this.client.ws.ping)}**ms`);
    }

    private pongCommand(message: Message) {
        message.channel.send(`🏓PING!!!!!!!!!!!!🏓`);
    }

    private unknownCommand(message: Message) {
        message.channel.send(":interrobang::interrobang:We couldn't find your command, make sure you typed it correctly.");
    }

    private async setAlbumLink(message: Message, args: string[]) {
        this.albumLink = args[0];
        //TODO: save the album link to a database or elsewhere.
        await message.channel.send("Your album has been successfully saved. A new photo will appear every day.");
        await message.channel.send("But for a sneak peek, here is the first one :D");
        this.sendRandomPhoto(message).catch(r => console.error(r));
    }


    private async sendRandomPhoto(message: Message) {
        if (this.albumLink === null || this.albumLink === undefined || this.albumLink.length < 20) return;
        const photos: ImageInfo[] | null = await GooglePhotosAlbum.fetchImageUrls(this.albumLink);
        const randomPhoto = Math.floor((Math.random() * Object.keys(photos).length) + 1);

        if (this.channelToSpeakIn === undefined) { // any channel
            await message.channel.send("Here's your pic LOL", {files: [photos[randomPhoto].url]});
            await message.channel.send(photos[randomPhoto].url);
            await message.channel.send("The photo was taken on the day: **" + new Date(photos[randomPhoto].imageUpdateDate).toLocaleDateString() + "**");
        } else { // selected channel
            await this.client.channels.cache.get(this.channelToSpeakIn).send("Here's your pic LOL", {files: [photos[randomPhoto].url]});
            await this.client.channels.cache.get(this.channelToSpeakIn).send(photos[randomPhoto].url);
            await this.client.channels.cache.get(this.channelToSpeakIn).send("The photo was taken on the day: **" + new Date(photos[randomPhoto].imageUpdateDate).toLocaleDateString() + "**");
        }
    }

    private async setChannel(message: Message, args: string[]) {
        const channelId = await this.client.channels.cache.find((channel: { name: string; }) => channel.name === args[0]).id;
        if (channelId !== undefined) {
            await message.channel.send("daily Image Bot will now only speak in: " + args);
            this.channelToSpeakIn = channelId;
        } else {
            await message.channel.send(":interrobang:Your channel couldn't be found. Please re-write it again :D");
        }
    }

    private helpCommand(message: Message) {
        message.channel.send(`    -------------------------------------------------------------------------------------
\`\`\`ini
[daily Image Bot has been summoned here beep boop bep bep ⚡ ⚡ ]
\`\`\`   
**daily Image Bot** :robot:
The prefix of the bot is: **\`!dimg\`**

**Command list**:fire: :
**\`help\`** **\`info\`** **\`channel\`** **\`albumlink\`** **\`ping\`** **\`pong\`**

This project is open source, and we will only store the channel id/server id and your album link.
For more information please visit *daily Image Bot Github repository*: https://github.com/Josee9988/daily-image-discord-bot
\`\`\`diff
+ Closing connection with dimg💔 
\`\`\``)
    }

    private infoCommand(message: any) {
        message.channel.send(
            `**dimg info**

**Contact the creator of the bot**:
LinkedIn: https://www.linkedin.com/in/jose-gracia/
GitHub: https://github.com/Josee9988
Email: jgracia9988@gmail.com
Personal page: http://jgracia.es/`);
    }
}
