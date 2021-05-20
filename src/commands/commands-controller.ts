import * as GooglePhotosAlbum from 'google-photos-album-image-url-fetch';
import {ImageInfo} from "google-photos-album-image-url-fetch/dist/imageInfo";
import {Message} from "discord.js";
import {CronJob} from 'cron';
import {sendRandomPhotoMessage} from "./command-messages-data";
import DatabaseController from "../db/database-controller";
import {IDimg} from "../db/dimg-interface";
import {helpCommand, infoCommand, pingCommand, pongCommand, unknownCommand} from "./informational-commands";
import checkIfUserIsAdmin from "./checkIfUserIsAdmin";

const shortUrl = require('node-url-shortener');


export default class CommandsController {
    private cronJob: CronJob;

    constructor(private PREFIX: string, private client: any, private databaseController: DatabaseController) {
        // 30 */12 * * *    (at minute 30 past every 12th hour) * * * * * for every minute (testing purposes)
        this.cronJob = new CronJob('30 */12 * * *', async () => {
            await this.sendRandomPhoto(false).catch((e: any) => console.error(e));
        });

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
                case "now":
                    await this.sendRandomPhoto(true, message);
                    break;
                case "help":
                    helpCommand(message);
                    break;
                case "info":
                    infoCommand(message, await this.databaseController.countDocuments());
                    break;
                case "ping":
                    await pingCommand(message, this.client.ws.ping);
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
            this.sendRandomPhoto(false, message).catch((e: any) => console.error(e));
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
     * @param forceChannelToBeTheSame if the message has to be sent from the same channel that the photos goes in.
     */
    private async sendRandomPhoto(forceChannelToBeTheSame: boolean, message?: Message): Promise<void> {
        if (message) { // if the message exists (it was called from setAlbumLink() or !dimg now command)
            let server = await this.databaseController.findByServerId(message.guild.id);
            if (server.albumLink && server.channelId) { // if the parameters are found and everything is ok

                if (forceChannelToBeTheSame) { // if we want the channel of the caller to be the same as the DB. (!dimg now)
                    if (!checkIfUserIsAdmin(message)) return;
                    if (server.channelId == message.channel.id) {
                        await this.fetchAndSendPhoto(server);
                    } else { // if the caller channel isn't the same show error
                        await message.channel.send(
                            ":interrobang:To use this command, talk in the previously selected channel");
                    }
                } else { // if it is called from setAlbumLink to display the 1st photo, after the !dimg albumlink
                    await this.fetchAndSendPhoto(server);
                }
            } else { // albumlink or channel id aren't set
                await message.channel.send(
                    ":interrobang:To use this command, specify first the channel and the albumlink." +
                    "Use the commands `!dimg channel nameOfYourChannel` and then `!dimg albumlink nameOfYourLink`");
            }
        } else { // CRON started the job. and we don't have the message available
            let dimgs = await this.databaseController.findAll();
            for (const dimg of dimgs) { // iterate over every document and send the photos to every respective server
                await this.fetchAndSendPhoto(dimg);
            }
        }
    }

    /**
     * Fetches for a random image and then it sends it to the specified channel.
     * @param dimg the dimg object to be searched in the database.
     */
    private async fetchAndSendPhoto(dimg: IDimg): Promise<void> {
        let isDetectedAFetchFail: boolean = false;
        if (dimg.albumLink === null || dimg.albumLink === undefined || dimg.albumLink.length < 20) return;
        const photos: ImageInfo[] | any = await GooglePhotosAlbum.fetchImageUrls(dimg.albumLink).catch(() => isDetectedAFetchFail = true);
        if (!photos || isDetectedAFetchFail) {
            console.debug("Photos object broken for serverId:: " + dimg.serverId)
            return;
        }
        const randomPhoto = Math.floor((Math.random() * Object.keys(photos).length) + 1);

        if (dimg.channelId) { // if the channel is specified send the image
            if (!photos[randomPhoto] || !photos[randomPhoto].url) {
                console.error("Url does not exist for server " + dimg.serverId + " with the photo object being like: " + photos[randomPhoto] + "object:");
                return;
            }
            await this.client.channels.cache.get(dimg.channelId)
                .send(photos[randomPhoto].url).catch((e: any) => console.error(`Couldn't send photo ${photos[randomPhoto]} with url ${photos[randomPhoto].url}.\nE: ${e}`));
            await this.client.channels.cache.get(dimg.channelId)
                .send(`${sendRandomPhotoMessage.msg2}**${new Date(photos[randomPhoto].imageUpdateDate).toLocaleDateString()}**`);

            // send the shortened url, and if not, just send the non shortened url
            let shortenedUrl = photos[randomPhoto].url;
            shortUrl.short(shortenedUrl, async (_err: any, receivedShortenedUrl: any) => {
                if (receivedShortenedUrl) shortenedUrl = receivedShortenedUrl;
                await this.client.channels.cache.get(dimg.channelId)
                    .send(`Check it out at: *${shortenedUrl}*`);
            });
        }
    }
}
