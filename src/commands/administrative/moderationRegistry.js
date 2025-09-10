const ModerationCommand = require("../../utils/moderationCommands.js");
const { PermissionFlagsBits,ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,MessageFlags } = require("discord.js");
const fs = require("fs");
const path = "./src/utils/logs/warnings.json";

const moderationConfigs = [
  {
    name: "kickuser",
    description: "Kick a user from the server",
    permissions: [PermissionFlagsBits.KickMembers],
    options: [
        { name: "target", description: "User to kick", type:6, required: true },
        { name: "reason", description: "Reason for kicking", type:3, required: false }
    ],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      const target = interaction.options.getUser("target");
      const member = await interaction.guild.members.fetch(target.id);
      await member.kick();
      await interaction.reply(`**${target.tag} has been kicked**`);
    }
  },  
  {
    name: "ban",
    description: "Ban a user from the server",
    permissions: [PermissionFlagsBits.BanMembers],
    options: [
        { name: "target", description: "User to ban", type:6, required: true },
        { name: "reason", description: "Reason for banning user", type:3, required: false }
    ],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      const target = interaction.options.getUser("target");
      await interaction.guild.members.ban(target.id);
      await interaction.reply(`**${target.tag} has been banned id: ${target.id}**`);
    }
  },
  {
    name:"warn",
    description:"Warn a user",
    permissions: [PermissionFlagsBits.KickMembers],
    options:[
        { name: "target", description: "User to warn", type:6, required: true },
        { name: "reason", description: "Reason for warning", type:3, required: false }
    ],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return await interaction.reply({ content: "You must be a  moderator to use this command.", ephemeral: true });
      } 
      await interaction.deferReply();

      const target = interaction.options.getUser("target");
      const reason = interaction.options.getString("reason") || "No reason provided";
  
      let data = {};
      if (fs.existsSync(path)) {
        const fileContent = fs.readFileSync(path, "utf8");
        if (fileContent) {
          data = JSON.parse(fileContent);
        }
      }
  
      const guildId = interaction.guild.id;
      data[guildId] ||= {};
      data[guildId][target.id] ||= [];
  
      data[guildId][target.id].push({
        reason,
        moderator: interaction.user.id,
        timestamp: Date.now()
      });
  
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      await interaction.editReply({ content: `Warned ${target.tag}: ${reason}`, ephemeral: false });
      try {
        await target.send(
          `You have received a warning in **${interaction.guild.name}** for: **${reason}**.\n` +
          `This is warning number ${data[guildId][target.id].length}.`
        );
      } catch (err) {
        console.log("Could not DM the user:", err.message);
      }
      console.log(`User ${target.tag} warned by ${interaction.user.tag} for: ${reason}`);
   }
  },
  {
    name:"clearwarn",
    description:"Clear all warnings for a user",
    permissions: [PermissionFlagsBits.KickMembers],
    options: [
      { name: "target", description: "User to clear warnings for", type: 6, required: true }
    ],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return await interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }
      await interaction.deferReply();
      const target = interaction.options.getUser("target");
  
      if (!fs.existsSync(path)) {
        return await interaction.editReply({ content: "No warnings found.", ephemeral: false });
      }
  
      const data = JSON.parse(fs.readFileSync(path));
      const guildId = interaction.guild.id;
  
      if (!data[guildId] || !data[guildId][target.id]) {
        return await interaction.editReply({ content: `${target.tag} has no warnings.`, ephemeral: false });
      }
  
      delete data[guildId][target.id];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
  
      await interaction.editReply({ content: `Cleared all warnings for ${target.tag}`, ephemeral: false });
    }
  },
  {
    name:"warnings",
    description:"List all warnings for a user",
    permissions: [PermissionFlagsBits.KickMembers],
    options: [
      { name: "target", description: "User to list warnings for", type: 6, required: true }
    ],
    execute: async (interaction) => {
      await interaction.deferReply();
      const target = interaction.options.getUser("target");
      if (!fs.existsSync(path)) {
        return await interaction.editReply({ content: "No warnings found.", ephemeral: false });
      }

      const fileContent = fs.readFileSync(path, "utf8");
      if (!fileContent) return await interaction.editReply({ content: "No warnings found.", ephemeral: false });

      const data = JSON.parse(fileContent);
      const guildId = interaction.guild.id;
      const userWarnings = data[guildId]?.[target.id] || [];
      if (userWarnings.length === 0) {
        return await interaction.editReply({ content: `${target.tag} has no warnings.`, ephemeral: false });
      }

      const warningsPerPage = 5;
      let page = 0;
      const totalPages = Math.ceil(userWarnings.length / warningsPerPage);

      const generateEmbed = (page) => {
      const start = page * warningsPerPage;
      const end = start + warningsPerPage;
      const currentWarnings = userWarnings.slice(start, end);

      return new EmbedBuilder()
        .setColor(0xffcc00)
        .setTitle(`Warnings for ${target.tag}`)
        .setDescription(currentWarnings.map((w, i) => `${start + i + 1}. ${w.reason} (by <@${w.moderator}>)`).join("\n"))
        .setFooter({ text: `Page ${page + 1} of ${totalPages}` });
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("prev").setLabel("⬅️ Previous").setStyle(ButtonStyle.Primary).setDisabled(page === 0),
      new ButtonBuilder().setCustomId("next").setLabel("Next ➡️").setStyle(ButtonStyle.Primary).setDisabled(page === totalPages - 1)
    );

    const message = await interaction.editReply({ embeds: [generateEmbed(page)], components: [row], ephemeral: false });

    const collector = message.createMessageComponentCollector({ time: 60000 }); 

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: "You can't control this pagination.", ephemeral: true });

      if (i.customId === "next" && page < totalPages - 1) page++;
      if (i.customId === "prev" && page > 0) page--;

      const newRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("prev").setLabel("⬅️ Previous").setStyle(ButtonStyle.Primary).setDisabled(page === 0),
        new ButtonBuilder().setCustomId("next").setLabel("Next ➡️").setStyle(ButtonStyle.Primary).setDisabled(page === totalPages - 1)
      );

      await i.update({ embeds: [generateEmbed(page)], components: [newRow] });
    });

    collector.on("end", async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("prev").setLabel("⬅️ Previous").setStyle(ButtonStyle.Primary).setDisabled(true),
        new ButtonBuilder().setCustomId("next").setLabel("Next ➡️").setStyle(ButtonStyle.Primary).setDisabled(true)
      );
      await interaction.editReply({ components: [disabledRow] });
    });
  }
  }, 
  {
    name: "unban",
    description: "Unban a user from the server",
    permissions: [PermissionFlagsBits.BanMembers],
    options: [{ name: "target", description: "User id to unban", type:3, required: true }],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      const targetId = interaction.options.getString("target").trim();
      await interaction.guild.members.unban(targetId);
      await interaction.reply(`**${targetId} has been unbanned**`);
    }
  },
  {
    name: "mute",
    description: "Mute (timeout) a user",
    options: [
      { name: "target", description: "User to mute", type: 6, required: true }, 
      { name: "days", description: "Days to mute", type: 4, required: true },     
      { name: "hours", description: "Hours to mute", type: 4, required: true },
      { name: "minutes", description: "Minutes to mute", type: 4, required: true },
      { name: "seconds", description: "Seconds to mute", type: 4, required: true }
    ],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }
  
      const target = interaction.options.getUser("target");
      const member = await interaction.guild.members.fetch(target.id);
  
      const days = interaction.options.getInteger("days");
      const hours = interaction.options.getInteger("hours");
      const minutes = interaction.options.getInteger("minutes");
      const seconds = interaction.options.getInteger("seconds");
  
      const durationMs = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
  
      if (durationMs <= 0 || durationMs > 28 * 24 * 60 * 60 * 1000) {
        return interaction.reply({ content: "Mute duration must be between 1 second and 28 days.", ephemeral: true });
      }
  
      await member.timeout(durationMs);
      await interaction.reply({
        content: `**${target.tag} has been muted for ${days}dys ${hours}hrs ${minutes}mins ${seconds}secs**`
      });
    }
  },
  {
    name: "unmute",
    description: "Remove mute (timeout) from a user",
    permissions: [PermissionFlagsBits.ModerateMembers],
    options: [{ name: "target", description: "User to unmute", type: 6, required: true }],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      const target = interaction.options.getUser("target");
      const member = await interaction.guild.members.fetch(target.id);
      await member.timeout(null);
      await interaction.reply(`**${target.tag} has been unmuted**`);
    }
  },
  {
    name: "purge",
    description: "Delete a number of messages",
    permissions: [PermissionFlagsBits.ManageMessages],
    options: [{ name: "amount", description: "Number of messages", type:4, required: true }],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      const amount = interaction.options.getInteger("amount");
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply(`**-- deleted ${amount} messages**`);
      setTimeout(async () => {
        await interaction.deleteReply().catch(() => {});
      },1500);
    }
  },
  {
    name: "lock",
    description: "Lock the current channel",
    permissions: [PermissionFlagsBits.ManageChannels],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
      });
      await interaction.reply(`**🔒 Channel locked**`);
    }
  },
  {
    name: "unlock",
    description: "Unlock the current channel",
    permissions: [PermissionFlagsBits.ManageChannels],
    execute: async (interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: "You must be a moderator to use this command.", ephemeral: true });
      }

      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: true,
      });
      await interaction.reply(`**🔓 Channel unlocked**`);
    }
  }
];

const commands = moderationConfigs.map(config => {
  const instance = new ModerationCommand(config);
  return {
    cooldown: 5,
    data: instance.getData(),
    execute: (...args) => instance.execute(...args)
  };
});

module.exports = commands;
