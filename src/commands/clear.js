const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player/dist');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Limpa a fila de música.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) {
			return interaction.reply({ content: 'Nenhuma música na fila!', ephemeral: true });
		}

		queue.tracks.clear();

		if (queue.metadata.dashboard) {
			const message = await queue.metadata.dashboard.messages.fetch();
			const embed = message.find(msg => msg.content === '').embeds[0];

			const musicEmbed = EmbedBuilder.from(embed);

			musicEmbed.setFields({
				name: 'Próxima música',
				value: 'Não tem.',
			});

			message.find(msg => msg.content === '').edit({
				embeds: [musicEmbed],
				components: [buttonRow],
			});
		}

		return interaction.reply({ content: 'Fila de músicas excluída!' });
	},
};
