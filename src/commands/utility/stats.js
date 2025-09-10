const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const process = require('process');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Displays bot statistics'),

    async execute(interaction) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const embed = new EmbedBuilder()
            .setColor(0x9146ff)
            .setTitle('📊 Bot Statistics')
            .addFields(
                { name: '🕒 Uptime', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: '📡 Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
                { name: '🌍 Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: '💻 Node.js', value: `${process.version}`, inline: true },
                { name: '📦 Discord.js', value: `v${require('discord.js').version}`, inline: true },
                { name: '🧠 Memory Usage', value: `${memoryUsage} MB`, inline: true },
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
