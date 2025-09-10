const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');
const { gemini_apikey } = require('../../config.json');

module.exports = {
    cooldown:10,
    data: new ContextMenuCommandBuilder()
        .setName('Translate')
        .setType(ApplicationCommandType.Message), 
    async execute(interaction) {
        let Model="gemini-2.0-flash-lite";
        await interaction.deferReply();
        const message = interaction.targetMessage; 
        const content = message.content;
        const ai = new GoogleGenAI({ apiKey: gemini_apikey });

        try {
            const response = await ai.models.generateContent({
                model: Model,
                contents: `Translate the text from whatever language it is in back to English. Return only the translated sentence and not a single other word than the translation: ${content}`
            });

            const translated = response.text;
            await interaction.editReply({ content: `Translated: ${translated}` });

        } catch (err) {
            console.error(err);
            if (err.message.includes('quota') || err.code === 429) {
                await interaction.editReply({
                    content: 'Daily request limit reached for Gemini API. Please try again, switching to a different model.',
                });
                Model="gemini-2.5-flash-lite";
            } else {
                await interaction.editReply({
                    content: 'An error occurred while translating the message.',
                });
            }
        }
    }
};
