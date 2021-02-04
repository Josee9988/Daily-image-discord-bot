import {DimgSchemaData} from './dimg-schema';
import * as mongoose from 'mongoose';
require('dotenv').config();

const dbUri: string = process.env.MONGO_URI;

export default class DatabaseController {

    constructor() {
        mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch(error => console.error(error));
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

    async findByServerId(serverId: string) {
        let rrr;
        await DimgSchemaData.findOne({serverId: serverId}).then((result) => {
            rrr = result;
        });
        console.log(rrr);
    }


}