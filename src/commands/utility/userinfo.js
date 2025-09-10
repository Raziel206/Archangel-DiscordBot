const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown:5,
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Shows info about a user')
        .addUserOption(option =>
            option.setName('target')
                  .setDescription('The user to get info about')
                  .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('target') || interaction.user; 
        const member = interaction.guild.members.cache.get(user.id);
        const isBooster = member.premiumSince? `<t:${Math.floor(member.premiumSince.getTime() / 1000)}:F>`:'Not boosting';
        const servername = member.displayName||member.globalName;

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id) 
            .map(role => role.toString())
            .join(', ') || 'None';

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL()})
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Server Name' , value: servername },
                { name: 'User ID', value: user.id },
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` },
                { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>` },
                { name: 'Server Boost', value: isBooster},
                { name: 'Roles', value: roles }
            )
            .setColor(0x9146ff)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
