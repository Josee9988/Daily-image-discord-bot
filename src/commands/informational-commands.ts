import {Message} from "discord.js";
import {helpMessage, infoMessage} from "./command-messages-data";

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
 * @param ping the API latency ping number.
 */
export function pingCommand(message: Message, ping: number): void {
    const msgToBeSend = `🏓Latency is **${Date.now() - message.createdTimestamp}**ms. API Latency is **${Math.round(ping)}**ms`
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
export function unknownCommand(message: Message) {
    const msgToBeSend = ":interrobang::interrobang:We couldn't find your command, make sure you typed it correctly.";
    message.channel.send(msgToBeSend)
        .catch((e) => permissionErrorHandler(msgToBeSend, e));
}