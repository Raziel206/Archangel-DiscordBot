const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about this server'),

    async execute(interaction) {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setColor(0x9146ff)
            .setTitle(`📑 Server Info: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '🌍 Region', value: `${guild.preferredLocale}`, inline: true },
                { name: '🆔 Server ID', value: guild.id, inline: true },
                { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
                { name: '💬 Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                { name: '📆 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '🔒 Verification Level', value: `${guild.verificationLevel}`, inline: true },
                { name: '💎 Boost Level', value: `${guild.premiumTier}`, inline: true },
                { name: '🚀 Boost Count', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
