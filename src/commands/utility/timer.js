const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const timers = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Set a countdown timer (max 24 hours)")
    .addIntegerOption(option =>
      option.setName("hours")
        .setDescription("Hours (0-24)")
        .setMinValue(0)
        .setMaxValue(24)
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("minutes")
        .setDescription("Minutes (0-59)")
        .setMinValue(0)
        .setMaxValue(59)
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("seconds")
        .setDescription("Seconds (0-59)")
        .setMinValue(0)
        .setMaxValue(59)
        .setRequired(true)
    ),

  async execute(interaction) {
    const hours = interaction.options.getInteger("hours");
    const minutes = interaction.options.getInteger("minutes");
    const seconds = interaction.options.getInteger("seconds");

    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

    if (totalMs <= 0) {
      return interaction.reply({ content: "⏱️ Please set a valid duration.", ephemeral: true });
    }
    if (totalMs > 24 * 3600 * 1000) {
      return interaction.reply({ content: "⏱️ Max timer duration is 24 hours.", ephemeral: true });
    }

    if (timers.has(interaction.user.id)) {
      clearTimeout(timers.get(interaction.user.id));
      timers.delete(interaction.user.id);
    }

    const startEmbed = new EmbedBuilder()
      .setColor('Green')
      .setTitle("⏱️ Timer Started")
      .setDescription(
        `I'll remind you in **${hours}h ${minutes}m ${seconds}s**.\nYou can continue using Discord meanwhile!`
      )
      .setFooter({ text: "Maximum duration is 24 hours." });

    await interaction.reply({ embeds: [startEmbed], ephemeral: false });

    const timeout = setTimeout(async () => {
      try {
        const endEmbed = new EmbedBuilder()
          .setColor(0x9146ff)
          .setTitle("⏰ Timer Finished")
          .setDescription(`<@${interaction.user.id}> your timer of **${hours}h ${minutes}m ${seconds}s** is over!`)
          .setTimestamp();

        await interaction.followUp({content:`<@${interaction.user.id}>`, embeds: [endEmbed] });
      } catch (e) {
        console.error("Failed to send timer completion message:", e);
      }
      timers.delete(interaction.user.id);
    }, totalMs);

    timers.set(interaction.user.id, timeout);
  }
};
