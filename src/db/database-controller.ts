import {DimgSchemaData} from './dimg-schema';
import * as mongoose from 'mongoose';

const dbUri: string = process.env.MONGO_URI;



export default class DatabaseController {

    constructor() {


        mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true  }).
        catch(error => console.error(error));


        module.exports = async () => {
            await mongoose.connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            return mongoose;
        }
    }

    createServerConnection(serverId: string) {
        const newServer = new DimgSchemaData({
            serverId: serverId,
        })
        DimgSchemaData.create(newServer)
            .then((result) => console.log(result))
            .catch((e) => console.error(e));
    }


}