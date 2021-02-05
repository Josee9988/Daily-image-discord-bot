import * as GooglePhotosAlbum from 'google-photos-album-image-url-fetch';
import {ImageInfo} from "google-photos-album-image-url-fetch/dist/imageInfo";
import {Message} from "discord.js";
import {CronJob} from 'cron';
import {sendRandomPhotoMessage} from "./command-messages-data";
import DatabaseController from "../db/database-controller";
import {IDimg} from "../db/dimg-interface";
import {helpCommand, infoCommand, pingCommand, pongCommand, unknownCommand} from "./informational-commands";

export default class CommandsController {
    private cronJob: CronJob;

    constructor(private PREFIX: string, private client: any, private databaseController: DatabaseController) {

        // 30 */12 * * *    (at minute 30 past every 12th hour) * * * * * for every minute (testing purposes)
        this.cronJob = new CronJob('30 */12 * * *', async () => {
            await this.sendRandomPhoto().catch((e) => console.error(e));
        });

        // Start cron job
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
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
                    helpCommand(message);
                    break;
                case "info":
                    infoCommand(message);
                    break;
                case "ping":
                    pingCommand(message, this.client.ws.ping);
                    break;
                case "pong":
                    pongCommand(message);
                    break;
                default:
                    unknownCommand(message);
            }
        }
    }

    async sendRandomPhotoCall(dimg: IDimg, message?: Message) {
        if (dimg.albumLink === null || dimg.albumLink === undefined || dimg.albumLink.length < 20) return;
        const photos: ImageInfo[] | null = await GooglePhotosAlbum.fetchImageUrls(dimg.albumLink);
        const randomPhoto = Math.floor((Math.random() * Object.keys(photos).length) + 1);

        if (dimg.channelId !== undefined) { // channel specified
            await this.client.channels.cache.get(dimg.channelId).send(sendRandomPhotoMessage.msg1, {files: [photos[randomPhoto].url]});
            await this.client.channels.cache.get(dimg.channelId).send(photos[randomPhoto].url);
            await this.client.channels.cache.get(dimg.channelId).send(sendRandomPhotoMessage.msg2 + "**" + new Date(photos[randomPhoto].imageUpdateDate).toLocaleDateString() + "**");
        }
    }

    private async setAlbumLink(message: Message, args: string[]) {
        if (!this.checkIfUserIsAdmin(message)) return;
        const server = await this.databaseController.findByServerId(message.guild.id);
        if (server.channelId) {
            await this.databaseController.setAlbumLink(message.guild.id, args[0]);
            await message.channel.send("Your album has been successfully saved. A new photo will appear every day in your selected channel.");
            await message.channel.send("But for a sneak peek, I'll post one in your selected channel!");
            this.sendRandomPhoto(message).catch(r => console.error(r));
        } else { // no channel specified
            await message.channel.send(":interrobang:Please specify a channel first with `!dimg channel nameOfYourChannel`");
        }
    }

    private async sendRandomPhoto(message?: Message) {
        if (message) { // if the message exists (it was called from setAlbumLink())
            let server = await this.databaseController.findByServerId(message.guild.id);
            await this.sendRandomPhotoCall(server, message);
        } else { // cron started the job. and we don't have the message available
            let dimgs = await this.databaseController.findAll();
            for (const dimg of dimgs) {
                await this.sendRandomPhotoCall(dimg, undefined);
            }
        }
    }

    private async setChannel(message: Message, args: string[]) {
        if (!this.checkIfUserIsAdmin(message)) return;
        const channelId = await this.client.channels.cache.find((channel: { name: string; }) => channel.name === args[0]).id;
        if (channelId) {
            await this.databaseController.setChannel(message.guild.id, channelId);
            await message.channel.send("daily Image Bot will now only speak in: " + args);
        } else {
            await message.channel.send(":interrobang:Your channel couldn't be found. Please re-write it again :D");
        }
    }

    /**
     * Function that checks if the user that send the message(command) is admin,
     * if not, it will return false and reply with further instructions.
     *
     * @param message the message with the command
     * @return boolean true|false True if the user is admin, otherwise false.
     */
    private checkIfUserIsAdmin(message: Message): boolean {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            return true;
        } else {
            message.reply(':interrobang:This command can only be executed by an **administrator**!')
            return false;
        }
    }
}
