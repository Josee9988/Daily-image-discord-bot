import {Message} from "discord.js";
import {helpMessage, infoMessage} from "./command-messages-data";


export function helpCommand(message: Message) {
    message.channel.send(helpMessage.msg).catch(() => console.log("Couldn't send help command message."));
}

export function infoCommand(message: Message) {
    message.channel.send(infoMessage.msg).catch(() => console.log("Couldn't send info command message."));
}

export function pingCommand(message: Message, ping:number) {
    message.channel.send(`🏓Latency is **${Date.now() - message.createdTimestamp}**ms. API Latency is **${Math.round(ping)}**ms`)
        .catch(() => console.log("Couldn't send ping command message."));
}

export function pongCommand(message: Message) {
    message.channel.send(`🏓PING!!!!!!!!!!!!🏓`)
        .catch(() => console.log("Couldn't send pong command message."));
}

export function unknownCommand(message: Message) {
    message.channel.send(":interrobang::interrobang:We couldn't find your command, make sure you typed it correctly.")
        .catch(() => console.log("Couldn't send unknown command message."));
}