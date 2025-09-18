const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, AttachmentBuilder, MessageFlags } = require("discord.js");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../utils/logs/greetings.json");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Preview or configure the welcome message.")
    .addStringOption(option =>
      option.setName("set")
        .setDescription("Enable or disable welcome message")
        .addChoices(
          { name: "true", value: "true" },
          { name: "false", value: "false" }
        )
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Set the welcome channel")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("description")
        .setDescription("Set the welcome message description")
        .setRequired(false)
    ).addStringOption(option =>
      option.setName("color")
        .setDescription("Set the embed color (hex code, e.g., #FF5733)")
        .setRequired(false)
    )
    ,

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: "❌ You need to be a moderator to use this command.", ephemeral: true });
    }
    const setOption = interaction.options.getString("set");
    const channelOption = interaction.options.getChannel("channel");
    const description= interaction.options.getString("description");
    const color= interaction.options.getString("color");

    let data = {};
    if (fs.existsSync(filePath)) {
        const file=fs.readFileSync(filePath,"utf8");
        if (file)   
        data = JSON.parse(fs.readFileSync(filePath));
    }

    const guildId = interaction.guild.id;
    data[guildId] ||= {};

    if (!setOption && !channelOption && !description && !color) {
        const file =new AttachmentBuilder(path.join(__dirname, "../../../assets/botAssets/welcomeBanner.png"))
        .setName("welcomeBanner.png");
        const previewEmbed = new EmbedBuilder()
        .setColor(0x87CEEB) 
        .setAuthor({ 
          name: interaction.guild.name, 
          iconURL: interaction.user.displayAvatarURL()
        })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setTitle(`welcome to ${interaction.guild.name}, darling!`)
        .setDescription(
          `- ✨ Get your roles in #roles\n` +
          `- 📜 Remember to read the #rules\n` +
          `- [🔗 Link to server](https://discord.gg/YOUR_INVITE_CODE)\n`
        )
        .setImage("attachment://welcomeBanner.png")
        .setFooter({ 
          text: `${new Date().toLocaleString()}` 
        });

      return interaction.reply({ content: `welcome, <@${interaction.user.id}>!`, embeds: [previewEmbed], files: [file] });
    }

    if (setOption) {
      data[guildId].enabled = (setOption === "true");
    }
    if (channelOption) {
      data[guildId].channel = channelOption.id;
    }
    if(description){
      data[guildId].description=description;
    }
    if(color){
      if(/^#([0-9A-F]{3}){1,2}$/i.test(color)){
        data[guildId].color=color; 
      }
      else {
        return interaction.reply({ content: "❌ Invalid color format. Please provide a valid hex color code (e.g., #FF5733).", flags : MessageFlags.Ephemeral }); 
      }
    }        

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return interaction.reply({
        content: `✅ Welcome settings updated:\n` +
       `- Enabled: **${data[guildId].enabled ?? "false"}**\n` +
       `- Channel: **${data[guildId].channel ? `<#${data[guildId].channel}>` : "not set"}**\n` +
       `- Color: **${data[guildId].color ?? "default"}**\n` +
       `- Description: **${data[guildId].description ?? "null"}**\n`,
        flags : MessageFlags.Ephemeral
      });
  }
};
