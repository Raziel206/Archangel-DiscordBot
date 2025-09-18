const {Events, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../utils/logs/greetings.json");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try{
            console.log(`${member.user.username} joined the ${member.guild.name} server.`);
            let data = {};
            if (fs.existsSync(filePath)) {
                const file=fs.readFileSync(filePath,"utf8");
                if (file)   
                data = JSON.parse(fs.readFileSync(filePath));
            }
            const guildId = member.guild.id;
            if (!data[guildId] || !data[guildId].enabled || !data[guildId].channel) return; 
            const channel = member.guild.channels.cache.get(data[guildId].channel);
            if (!channel){
                console.log(`Channel with ID ${data[guildId].channel} not found in guild ${member.guild.name}.`);
                return;
            }
            const description = data[guildId].description || "";
            const color = data[guildId].color || "#87CEEB";
    
            const file =new AttachmentBuilder(path.join(__dirname, "../../assets/botAssets/welcomeBanner.png")).setName("welcomeBanner.png");
            const welcomeEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({
                    name: member.guild.name,
                    iconURL: member.user.displayAvatarURL()
                })
                .setThumbnail(member.guild.iconURL({ dynamic: true, size: 1024 }))
                .setTitle(`welcome to ${member.guild.name}, darling!`)
                .setDescription(description || "")
                .setImage("attachment://welcomeBanner.png")
                .setFooter({ 
                    text: `We now have ${member.guild.memberCount} members!`,
                    iconURL: member.guild.iconURL()
                })
                .setTimestamp();
            return channel.send({ content: `welcome, <@${member.user.id}>!`, embeds: [welcomeEmbed], files: [file] });
        }
        catch(err){
            console.log(err);
        }   
    }
};