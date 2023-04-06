const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Limpa a fila de música.'),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música na fila!', ephemeral: true });
		}
		queue.tracks.clear();
		return interaction.followUp({ content: 'Fila de músicas excluída!' });
	},
};
