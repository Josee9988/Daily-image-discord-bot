export const helpMessage = // Message for the command "help"
    {
        msg: `    -------------------------------------------------------------------------------------
\`\`\`ini
[daily Image Bot has been summoned here beep boop bep bep ⚡ ⚡ ]
\`\`\`   
**daily Image Bot** :robot:
The prefix of the bot is: **\`!dimg\`**

**Command list**:fire: :
**\`help\`** **\`info\`** **\`channel\`** **\`albumlink\`** **\`sendmsg\`** **\`now\`** **\`ping\`** **\`pong\`**

This project is **open source**, and we will only store the channel-id/server-id and your public album link for basic usability of the bot.
For more information please visit *Daily Image Bot Github repository*: https://github.com/Josee9988/daily-image-discord-bot`
    };

export const infoMessage = // Message for the command "info"
    {
        msg: `**dimg info**

**Contact links**:
Support the bot ❤️: https://github.com/sponsors/Josee9988/
Upvote the bot at ❤️: https://top.gg/bot/806274731245436960/
LinkedIn: https://www.linkedin.com/in/jose-gracia/
GitHub: https://github.com/Josee9988/
Dev.to: https://dev.to/josee9988/
Email: jgracia9988@gmail.com

**Bot's repository**: https://github.com/Josee9988/Daily-image-discord-bot/
**Report any issues or request a feature at:**: https://github.com/Josee9988/Daily-image-discord-bot/issues/`
    };

export const sendRandomPhotoMessage = // Message for the function sendRandomPhoto (called by the cron)
    {
        msg1: "Here's your pic LOL",
        msg2: "The photo was taken on the day: "
    };

export const welcomeOwnerPrivatelyMessage = // Message for the function welcomeOwnerPrivately
    {
        msg: `Hi server owner: :grinning:

Thanks for choosing **Daily Image Bot** for your server.
Please make sure you check our simple documentation and our quick installation guide at: *https://github.com/Josee9988/Daily-image-discord-bot#daily-image-discord-bot*. After you set up the bot, it will send a random photo every 12h.

To save you time here is a super simplified **installation guide**. :gear:
1. \`!dimg channel nameOfYourChannel\` to select the channel where the images will be sent.
2. \`!dimg albumlink linkOfYourPublicGooglePhotosAlbum\` to specify the bot the link of the public google photos album.
3. (extra). \`!dimg now\` to force the bot to publish a photo now. (this command must be sent in the selected channel).
4. (extra). \`!dimg sendmsg\` to modify the send message.

**Security** :shield:
- This bot is fully **open-source** and **free**, and we only store the minimum information for the good performing of the bot (server id, channel id and album link), so you can feel safe with us. You can also check our code repository in case you wanted to contribute to the development or fix/notify any possible bug.
- The commands \`!dimg channel\`, \`!dimg sendmsg\`, \`!dimg albumlink\` and \`!dimg now\` can only be executed by the server administrators (to avoid server trolls).

If you wanted to **contact the owner of the bot**: :e_mail:
Support the bot ❤️: https://github.com/sponsors/Josee9988/
Upvote the bot at ❤️: https://top.gg/bot/806274731245436960/
LinkedIn: https://www.linkedin.com/in/jose-gracia/
GitHub: https://github.com/Josee9988/
Dev.to: https://dev.to/josee9988/
Email: jgracia9988@gmail.com

**Bot's repository**: https://github.com/Josee9988/Daily-image-discord-bot/
**Report any issues or request a feature at:**: https://github.com/Josee9988/Daily-image-discord-bot/issues/

Thanks, and enjoy!!!`
    };