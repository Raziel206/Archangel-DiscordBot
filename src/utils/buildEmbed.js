const { EmbedBuilder } = require("discord.js");

class CustomEmbed {
    constructor(userName, pfp, action, gif) {
        this.userName = userName;
        this.pfp = pfp;
        this.action = action;
        this.gif = gif;
    }

    getEmbed() {
        return new EmbedBuilder()
            .setColor(0xfdd017)
            .setAuthor({ name: this.userName, iconURL: this.pfp})
            .setDescription(this.action)
            .setImage(this.gif)
            .setTimestamp();
    }
}
module.exports = CustomEmbed;
