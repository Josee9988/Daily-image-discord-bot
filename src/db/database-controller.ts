import {DimgSchemaData} from './dimg-schema';
import * as mongoose from 'mongoose';
import {IDimg} from "./dimg-interface";

require('dotenv').config();

export default class DatabaseController {
    constructor() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).catch((e: any) => console.error(`Couldn't connect to MongoDB, ERROR: ${e}`));
    }

    /**
     * Retrieves all documents in the database.
     */
    async findAll(): Promise<IDimg[]> {
        let serversFound = null;
        await DimgSchemaData.find().then((result) => {
            serversFound = result;
        });
        return serversFound;
    }

    /**
     * Finds the document with the server id given.
     * @param serverId the id of the server.
     */
    async findByServerId(serverId: string): Promise<IDimg> {
        let serverFound = null;
        await DimgSchemaData.findOne({serverId: serverId}).then((result) => {
            serverFound = result;
        });
        return serverFound;
    }

    /**
     * Creates a document only with the server id.
     * @param serverId the id of the server.
     */
    async createServerEntity(serverId: string): Promise<void> {
        const newServer = new DimgSchemaData({
            serverId: serverId,
        })
        DimgSchemaData.create(newServer)
            .catch((e: any) => console.error(e));
    }

    /**
     * Deletes the document with the server id given.
     * @param serverId the id of the server.
     */
    async deleteServerEntity(serverId: string): Promise<void> {
        DimgSchemaData.deleteOne({serverId: serverId})
            .catch((e: any) => console.error(e));
    }

    /**
     * Sets/updates a channel from an element with the server id given.
     * @param serverId the id of the server.
     * @param channelId the channel to be set/updated.
     */
    async setChannel(serverId: string, channelId: string): Promise<void> {
        DimgSchemaData.findOneAndUpdate({'serverId': serverId}, {$set: {channelId: channelId}})
            .catch((e: any) => console.error(e));
    }

    /**
     * Counts the number of documents in the database and return that number.
     */
    async countDocuments(): Promise<number> {
        let docCount = 0;
        DimgSchemaData.countDocuments().then((num: number) => {
            docCount = num;
        });
        return docCount;
    }


    /**
     * Sets/updates an album link from an element with the server id given.
     * @param serverId the id of the server.
     * @param albumLink the link of the album to be set/updated.
     */
    async setAlbumLink(serverId: string, albumLink: string): Promise<void> {
        DimgSchemaData.findOneAndUpdate({'serverId': serverId}, {$set: {albumLink: albumLink}})
            .catch((e: any) => console.error(e));
    }
}