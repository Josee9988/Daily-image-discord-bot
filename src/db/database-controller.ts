import {DimgSchemaData} from './dimg-schema';
import * as mongoose from 'mongoose';
import {IDimg} from "./dimg-interface";

require('dotenv').config();

const dbUri: string = process.env.MONGO_URI;

export default class DatabaseController {

    constructor() {
        mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true
        }).catch(error => console.error(error));
    }

    async findAll(): Promise<IDimg[]> {
        let serversFound = null;
        await DimgSchemaData.find().then((result) => {
            serversFound = result;
        });
        return serversFound;
    }

    async findByServerId(serverId: string): Promise<IDimg> {
        let serverFound = null;
        await DimgSchemaData.findOne({serverId: serverId}).then((result) => {
            serverFound = result;
        });
        return serverFound;
    }

    async createServerEntity(serverId: string) {
        const newServer = new DimgSchemaData({
            serverId: serverId,
        })
        DimgSchemaData.create(newServer)
            .catch((e) => console.error(e));
    }

    async deleteServerEntity(serverId: string) {
        DimgSchemaData.deleteOne({serverId: serverId} )
            .catch((e) => console.error(e));
    }

    async setChannel(serverId: string, channelId: string) {
        DimgSchemaData.findOneAndUpdate({'serverId': serverId}, {$set: {channelId: channelId}})
            .catch((e) => console.error(e));
    }

    async setAlbumLink(serverId: string, albumLink: string) {
        DimgSchemaData.findOneAndUpdate({'serverId': serverId}, {$set: {albumLink: albumLink}})
            .catch((e) => console.error(e));
    }


}