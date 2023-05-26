const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Limpa a fila de música.'),
	async execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música na fila!', ephemeral: true });
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

		return interaction.followUp({ content: 'Fila de músicas excluída!' });
	},
};
