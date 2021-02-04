import {DimgSchemaData} from './dimg-schema';
import * as mongoose from 'mongoose';

const dbUri: string = process.env.MONGO_URI;



export default class DatabaseController {

    constructor() {
        mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            reconnectTries: 500,
            reconnectInterval: 100000
        }).catch(error => console.error(error));
    }

    createServerEntity(serverId: string) {
        const newServer = new DimgSchemaData({
            serverId: serverId,
        })
        DimgSchemaData.create(newServer)
            .then((result) => console.log(result))
            .catch((e) => console.error(e));
    }

    setChannel(serverId: string, channelId: string) {
        DimgSchemaData.findOneAndUpdate({'serverId': serverId}, {$set: {channelId: channelId}})
            .catch((e) => console.error(e));
    }

    setAlbumLink(serverId: string, albumLink: string) {
        DimgSchemaData.findOneAndUpdate({'serverId': serverId}, {$set: {albumLink: albumLink}})
            .catch((e) => console.error(e));
    }


}