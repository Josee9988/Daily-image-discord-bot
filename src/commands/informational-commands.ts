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
 */
export function infoCommand(message: Message): void {
    message.channel.send(infoMessage.msg).catch((e: any) => permissionErrorHandler(infoMessage.msg, e));
}

/**
 * Ping command, triggered by "!dimg ping".
 * @param message the message received that triggered the command.
 * @param ping the API latency, database and main latency ping ms.
 */
export async function pingCommand(message: Message, ping: number): Promise<void> {
    const latency = Date.now() - message.createdTimestamp;
    const apiLatency = Math.round(ping);
    const databasePing = connection.db.admin().ping(function (err, result) {
        if (err || !result) return (err || new Error('*unknown ping*'));
        return ping;
    });
    const msgToBeSend =
        `🏓Latency is **${latency}** ms.
    API latency is **${apiLatency}** ms.
    Database latency is: **${databasePing}** ms.`
    message.channel.send(msgToBeSend)
        .catch((e: any) => permissionErrorHandler(msgToBeSend, e));
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
