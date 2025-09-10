const { SlashCommandBuilder,EmbedBuilder} = require("discord.js");

module.exports={
    cooldown:5,
    data:new SlashCommandBuilder().setName("avatar").setDescription("displays the enlarges profile picture of the user").addUserOption(option => option.setName("target").setDescription("The user whose avater you want to display").setRequired(false)),
    async execute(interaction){
        let image='',username='';
        const target=interaction.options.getUser("target");
        if(target){
            image=target.displayAvatarURL({ size: 2048 });
            username=target.username;
        }
        else{
            image=interaction.user.displayAvatarURL({ size: 2048 });
            username=interaction.user.username;
        }
        const embed= new EmbedBuilder()
        .setColor(0x9146ff)
        .setAuthor({name: username,iconURL: image})
        .setImage(image)
        .setTimestamp();
        await interaction.reply({embeds :[embed]});
    }
}