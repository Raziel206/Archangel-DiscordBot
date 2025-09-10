const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

class ModerationCommand {
  constructor({ name, description, permissions, options, execute }) {
    this.name = name;
    this.description = description;
    this.permissions = permissions || [];
    this.options = options || [];
    this._execute = execute;
  }

  getData() {
    const builder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);

    if (this.permissions.length > 0) {
      builder.setDefaultMemberPermissions(this.permissions.reduce((a, b) => a | b));
    }
    
    if(this.options.length > 0){
        for (const opt of this.options) {   
          switch (opt.type) {
            case 3: 
              builder.addStringOption(s =>
                s.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 4: 
              builder.addIntegerOption(i =>
                i.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 5: 
              builder.addBooleanOption(b =>
                b.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 6: 
              builder.addUserOption(u =>
                u.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 7: 
              builder.addChannelOption(c =>
                c.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 8: 
              builder.addRoleOption(r =>
                r.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 9:
              builder.addMentionableOption(m =>
                m.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 10: 
              builder.addNumberOption(n =>
                n.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            case 11: 
              builder.addAttachmentOption(a =>
                a.setName(opt.name)
                 .setDescription(opt.description)
                 .setRequired(opt.required || false)
              );
              break;
            default:
              throw new Error(`Unsupported option type: ${opt.type}`);
          }
        }
    }

    return builder;
  }

  async execute(interaction) {
    return this._execute(interaction);
  }
}

module.exports = ModerationCommand;
