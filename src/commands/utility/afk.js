const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const afkMap = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your AFK status")
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for being AFK")
        .setRequired(false)
    ),

  async execute(interaction) {
    const reason = interaction.options.getString("reason") || "No reason provided";
    afkMap.set(interaction.user.id, reason);

    const embed = new EmbedBuilder()
      .setColor(0xffc107)
      .setTitle("🚶 AFK Status Set")
      .setDescription(`You are now marked as AFK.\n**Reason:** ${reason}`)
      .setFooter({ text: "You'll be unmarked when you send a message." });

    await interaction.reply({ embeds: [embed], ephemeral: true });

    if (!interaction.client.afkListenerAdded) {
      interaction.client.on("messageCreate", async (message) => {
        if (message.author.bot) return;

        if (afkMap.has(message.author.id)) {
          afkMap.delete(message.author.id);
          await message.reply(`Welcome back, <@${message.author.id}>! I’ve removed your AFK status.`);
        }

        if (message.mentions.users.size) {
          message.mentions.users.forEach(user => {
            if (afkMap.has(user.id)) {
              const reason = afkMap.get(user.id);
              const member= interaction.guild.members.cache.get(user.id);
              message.reply(`${member.displayName||member.globalName} is AFK, reason : ${reason}`);
            }
          });
        }
      });

      interaction.client.afkListenerAdded = true;
    }
  }
};
