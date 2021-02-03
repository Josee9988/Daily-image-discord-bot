export default class Commands {

    constructor(private PREFIX: string, private client: any) {

    }

    messageHandler(message: any) {
        if (message.author.bot) return; //ignore bot messages
        if (message.content.startsWith(this.PREFIX)) {
            const [CMD_NAME, ...args] = message.content
                .trim()
                .substring(this.PREFIX.length + 1)
                .split(/\s+/);


            switch (CMD_NAME.toLocaleLowerCase()) {
                case "help":
                    this.helpCommand(message);
                    break;
                case "ping":
                    this.pingCommand(message);
                    break;
                case "pong":
                    this.pongCommand(message);
                    break;
                default:
                    this.unknownCommand(message);
            }

        }
    }


    private helpCommand(message: any) {
        message.channel.send(`
    -------------------------------------------------------------------------------------
\`\`\`ini
[Dialy Image Bot has been summoned here beep boop bep bep ⚡ ⚡ ]
\`\`\`   
**Dialy Image Bot** :robot:
The prefix of the bot is: **\`!dimg\`**

**Command list**:fire: :
**\`help\`** **\`channel\`** **\`albumlink\`** **\`ping\`** **\`pong\`**

For more information please visit *Dialy Image Bot Github repository*: https://github.com/Josee9988/Dialy-image-discord-bot
\`\`\`diff
+ Closing connection with dimg💔 
\`\`\`
    `)
    }


    private pingCommand(message: any) {
        message.channel.send(`🏓Latency is **${Date.now() - message.createdTimestamp}**ms. API Latency is **${Math.round(this.client.ws.ping)}**ms`);
    }

    private pongCommand(message: any) {
        message.channel.send(`🏓PING!!!!!!!!!!!!🏓`);
    }

    private unknownCommand(message: any) {
        message.channel.send(":interrobang::interrobang:We couldn't find your command, make sure you typed it correctly.");
    }
}