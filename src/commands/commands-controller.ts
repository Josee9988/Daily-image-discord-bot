import * as GooglePhotosAlbum from 'google-photos-album-image-url-fetch';
import {ImageInfo} from "google-photos-album-image-url-fetch/dist/imageInfo";
import {Message} from "discord.js";
import {CronJob} from 'cron';
import {sendRandomPhotoMessage} from "./command-messages-data";
import DatabaseController from "../db/database-controller";
import {IDimg} from "../db/dimg-interface";
import {helpCommand, infoCommand, pingCommand, pongCommand, unknownCommand} from "./informational-commands";
import checkIfUserIsAdmin from "./checkIfUserIsAdmin";

export default class CommandsController {
    private cronJob: CronJob;

    constructor(private PREFIX: string, private client: any, private databaseController: DatabaseController) {
        // 30 */12 * * *    (at minute 30 past every 12th hour) * * * * * for every minute (testing purposes)
        this.cronJob = new CronJob('30 */12 * * *', async () =>
            await this.sendRandomPhoto().catch((e: any) => console.error(e)));

        // Start cron job
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
    }

    /**
     * Function that processes all the messages and redirects to the command methods if the message starts with "!dimg"
     * @param message any message typed in by the user.
     */
    public async messageHandler(message: Message): Promise<void> {
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
                default: // command unknown
                    unknownCommand(message);
            }
        }
    }

    /**
     * Sets an album link in the database.
     * @param message the message that called the command.
     * @param albumToBeSet the album link to be set.
     */
    private async setAlbumLink(message: Message, albumToBeSet: string[]): Promise<void> {
        if (!checkIfUserIsAdmin(message)) return;
        const server = await this.databaseController.findByServerId(message.guild.id);
        if (server.channelId) {
            await this.databaseController.setAlbumLink(message.guild.id, albumToBeSet[0]);
            await message.channel.send("Your album has been successfully saved. A new photo will appear every day in your selected channel.");
            await message.channel.send("But for a sneak peek, I'll post one in your selected channel!");
            this.sendRandomPhoto(message).catch((e: any) => console.error(e));
        } else { // no channel specified
            await message.channel.send(":interrobang:Please specify a channel first with `!dimg channel nameOfYourChannel`");
        }
    }

    /**
     * Sets a channel in the database.
     * @param message the message that called the command.
     * @param channelToBeSet the channel to be set.
     */
    private async setChannel(message: Message, channelToBeSet: string[]): Promise<void> {
        if (!checkIfUserIsAdmin(message)) return;
        const channelId = await this.client.channels.cache.find(
            (channel: { name: string; }) => channel.name === channelToBeSet[0]);
        if (channelId && channelId.id) {
            await this.databaseController.setChannel(message.guild.id, channelId.id);
            await message.channel.send("Daily Image Bot will now only speak in: " + channelToBeSet);
        } else {
            await message.channel.send(":interrobang:Your channel couldn't be found. Please re-write it again :D");
        }
    }

    /**
     * Check makes the calls to send a random photo to the specified channel
     * @param message the message that called it
     */
    private async sendRandomPhoto(message?: Message): Promise<void> {
        if (message) { // if the message exists (it was called from setAlbumLink())
            let server = await this.databaseController.findByServerId(message.guild.id);
            await this.fetchAndSendPhoto(server);
        } else { // cron started the job. and we don't have the message available
            let dimgs = await this.databaseController.findAll();
            for (const dimg of dimgs) {
                await this.fetchAndSendPhoto(dimg);
            }
        }
    }

    /**
     * Fetches for a random image and then it sends it to the specified channel.
     * @param dimg the dimg object to be searched in the database.
     */
    private async fetchAndSendPhoto(dimg: IDimg): Promise<void> {
        if (dimg.albumLink === null || dimg.albumLink === undefined || dimg.albumLink.length < 20) return;
        const photos: ImageInfo[] | null = await GooglePhotosAlbum.fetchImageUrls(dimg.albumLink);
        const randomPhoto = Math.floor((Math.random() * Object.keys(photos).length) + 1);

        if (dimg.channelId) { // if the channel is specified
            await this.client.channels.cache.get(dimg.channelId)
                .send(sendRandomPhotoMessage.msg1, {files: [photos[randomPhoto].url]});
            await this.client.channels.cache.get(dimg.channelId)
                .send(photos[randomPhoto].url);
            await this.client.channels.cache.get(dimg.channelId)
                .send(sendRandomPhotoMessage.msg2 + "**" + new Date(photos[randomPhoto].imageUpdateDate)
                    .toLocaleDateString() + "**");
        }
    }
}
