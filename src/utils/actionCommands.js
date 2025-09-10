const { SlashCommandBuilder } = require("discord.js");
const EmbedBuilder = require("./buildEmbed.js");
const Tenor = require("./fetchReq.js");

class ActionCommand {
    constructor({ name, description, searchTerms, actionWord }) {
        this.name = name;
        this.description = description;
        this.searchTerms = searchTerms;
        this.actionWord = actionWord;
    }

    getData() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName("target")
                    .setDescription(`The user you want to ${this.name}`)
                    .setRequired(true)
            );
    }

    async execute(interaction) {
        await interaction.deferReply();
        const searchTerm = this.searchTerms[
            Math.round(Math.random() * (this.searchTerms.length-1))
        ];
        const tenorApi = new Tenor(searchTerm);
        const gifUrl = await tenorApi.grabData();

        const target = interaction.options.getUser("target");
        const avatar = interaction.user.displayAvatarURL();
        const actionText = `${interaction.user} **${this.actionWord}** ${target} **!**`;

        const embedInstance = new EmbedBuilder(
            interaction.user.username,
            avatar,
            actionText,
            gifUrl || "https://i.imgur.com/404.gif" 
        );

        await interaction.editReply({ embeds: [embedInstance.getEmbed()] });
    }
}

module.exports = ActionCommand;
