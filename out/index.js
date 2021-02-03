"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const commands_1 = require("./commands");
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client();
const botCommands = new commands_1.default("!dimg", client);
client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(message.content);
    yield botCommands.messageHandler(message);
    console.log("end");
}));
client.login(process.env.DISCORDJS_BOT_TOKEN);
//# sourceMappingURL=index.js.map