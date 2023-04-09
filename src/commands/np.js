const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('np')
		.setDescription('Mostra a música que está tocando atualmente.'),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		return interaction.followUp({ embeds: [
			{
				title: 'Tocando agora',
				description: `**[${queue.currentTrack.title}](${queue.currentTrack.url})** - ${queue.currentTrack.author}`,
				fields: [
					{
						name: 'Requisitado por',
						value: `${!queue.currentTrack.requestedBy ? 'Não encontrei.' : queue.currentTrack.requestedBy}`,
					},
					{
						name: 'Progresso',
						value: `${queue.node.createProgressBar()}`,
					},
				],
				thumbnail: {
					url: queue.currentTrack.thumbnail,
				},
				color: 0x4D3A81,
			},
		] });
	},
};
