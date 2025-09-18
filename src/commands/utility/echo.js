const { 
    ContextMenuCommandBuilder, 
    ApplicationCommandType, 
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    PermissionsBitField,
    ChannelType,
    MessageFlags
} = require('discord.js');

module.exports = {
    cooldown:60,
    data: new ContextMenuCommandBuilder()
        .setName('Echo to Channel')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: '❌ You need **Administrator** permissions to use this command.',
                flags: MessageFlags.Ephemeral
            });
        }

        const targetMessage = interaction.targetMessage;

        const textChannels = interaction.guild.channels.cache
            .filter(c => c.type === ChannelType.GuildText)
            .sort((a,b) => a.position - b.position)
            .map(c => ({ label: c.name, value: c.id }));

        if (!textChannels.length) {
            return interaction.reply({ content: 'No text channels available.', flags: MessageFlags.Ephemeral });
        }

        let page = 0;
        const pageSize = 25;

        const generateMenu = (pageIndex) => {
            return new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-channel')
                    .setPlaceholder('Select a channel to send this message')
                    .addOptions(textChannels.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize))
            );
        };

        const prevButton = new ButtonBuilder()
            .setCustomId('prev-page')
            .setLabel('⬅️ Prev')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const nextButton = new ButtonBuilder()
            .setCustomId('next-page')
            .setLabel('Next ➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(textChannels.length <= pageSize);

        const rowButtons = new ActionRowBuilder().addComponents(prevButton, nextButton);


        const reply = await interaction.reply({ 
            content: 'Select a channel to echo this message:', 
            components: [generateMenu(page), rowButtons], 
            flags: MessageFlags.Ephemeral
        });

        const collector = reply.createMessageComponentCollector({ 
            componentType: ComponentType.MessageComponent, 
            time: 60000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: "This isn't for you!", flags: MessageFlags.Ephemeral });

            if (i.isStringSelectMenu()) {
                const channel = interaction.guild.channels.cache.get(i.values[0]);
                if (!channel) return i.update({ content: 'Selected channel not found!', components: [], flags: MessageFlags.Ephemeral });

                await channel.send({ content: targetMessage.content });
                await i.update({ content: `Message echoed to #${channel.name}!`, components: [], flags: MessageFlags.Ephemeral });
                collector.stop(); 
            }

            if (i.isButton()) {
                if (i.customId === 'prev-page' && page > 0) page--;
                if (i.customId === 'next-page' && (page + 1) * pageSize < textChannels.length) page++;

                prevButton.setDisabled(page === 0);
                nextButton.setDisabled((page + 1) * pageSize >= textChannels.length);

                await i.update({ components: [generateMenu(page), rowButtons] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ components: [], content: 'Selection timed out.', flags: MessageFlags.Ephemeral });
            }
        });
    },
};
