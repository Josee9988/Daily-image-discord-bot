import {Message} from "discord.js";
import {helpMessage, infoMessage} from "./command-messages-data";
import {connection} from "mongoose";

/**
 * Help command, triggered by "!dimg help".
 * @param message the message received that triggered the command.
 */
export function helpCommand(message: Message): void {
    message.channel.send(helpMessage.msg).catch((e: any) => permissionErrorHandler(helpMessage.msg, e));
}

/**
 * Info command, triggered by "!dimg info".
 * @param message the message received that triggered the command.
 * @param documentCount number of documents found in the DB
 */
export function infoCommand(message: Message, documentCount: number): void {
    message.channel.send(infoMessage.msg).catch((e: any) => permissionErrorHandler(infoMessage.msg, e));
    if (documentCount > 0) { // display doc count if it higher than 0 (no error has found while counting)
        const countDocsMsg = "There are currently: \"**" + documentCount + "**\" happy servers using Daily image bot :)";
        message.channel.send(countDocsMsg).catch((e: any) => permissionErrorHandler(countDocsMsg, e));
    }

}

/**
 * Ping command, triggered by "!dimg ping".
 * @param message the message received that triggered the command.
 * @param ping the API latency, database and main latency ping ms.
 */
export async function pingCommand(message: Message, ping: number): Promise<void> {
    const latency = Date.now() - message.createdTimestamp;
    const mongoDbConnectionStatus: string = await obtainDBStatus();

    const msgToBeSend =
        `🏓Latency is **${latency}** ms.
    API latency is **${Math.round(ping)}** ms.
    Database status is: **${mongoDbConnectionStatus}**.`
    message.channel.send(msgToBeSend)
        .catch((e: any) => permissionErrorHandler(msgToBeSend, e));
}

/**
 * Obtains the database connection status
 */
async function obtainDBStatus(): Promise<string> {
    let receivedStatus: number = -1;
    await new Promise((resolve, reject) => {
        connection.db.admin().ping((err, result: any) => {
            if (err || !result) (reject(err))
            resolve(result);
        })
    }).then((result: any) => receivedStatus = result.ok).catch((e: any) => receivedStatus = e.ok);

    let mongoDbConnectionStatus: any;
    switch (receivedStatus) {
        case 0:
            mongoDbConnectionStatus = 'disconnected';
            break;
        case 1:
        case 2:
            mongoDbConnectionStatus = 'connected';
            break;
        default:
            mongoDbConnectionStatus = 'failing';
            break;
    }
    return mongoDbConnectionStatus;
}

/**
 * Pong command, triggered by "!dimg pong".
 * @param message the message received that triggered the command.
 */
export function pongCommand(message: Message): void {
    const msgToBeSend = `🏓PING!!!!!!!!!!!!🏓`;
    message.channel.send(msgToBeSend)
        .catch((e: any) => permissionErrorHandler(msgToBeSend, e));
}

/**
 * Unknown command, triggered by "!dimg ???????".
 * @param message the message received that triggered the command.
 */
export function unknownCommand(message: Message): void {
    const msgToBeSend = ":interrobang::interrobang:We couldn't find your command, make sure you typed it correctly.";
    message.channel.send(msgToBeSend)
        .catch((e) => permissionErrorHandler(msgToBeSend, e));
}
