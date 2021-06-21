import * as mongoose from 'mongoose';

const DimgSchema = new mongoose.Schema({
    serverId: {type: String, required: true, unique: true},
    channelId: {type: String, required: false},
    albumLink: {type: String, required: false},
    sendMsg: {type: String, required: false}
});

export const DimgSchemaData = mongoose.model('dimg', DimgSchema)