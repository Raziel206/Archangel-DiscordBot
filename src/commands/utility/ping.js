const { SlashCommandBuilder, EmbedBuilder,MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong! and shows latency stats."),
    async execute(interaction) {
     try{   
        await interaction.deferReply({ withResponse: true });

        const sent = await interaction.fetchReply();

        const messageLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = interaction.client.ws.ping >= 0 ? `${interaction.client.ws.ping} ms` : "N/A";

        const start = Date.now();
        await interaction.editReply("Measuring REST latency...");
        const restLatency = Date.now() - start;

        const embed = new EmbedBuilder()
            .setColor(0x9146ff)
            .setTitle("🏓 Pong!")
            .addFields(
                { name: "Message Latency", value: `${messageLatency} ms` },
                { name: "API Latency", value: apiLatency },
                { name: "REST Latency", value: `${restLatency} ms` },
            )
            .setTimestamp();

        await interaction.editReply({ content: "", embeds: [embed] });
       }catch(error){
        console.error(error);
        await interaction.reply({content :`Exceded interaction acknowledgement timeframe`, flags:MessageFlags.Ephemeral})
       }  
    },
};
