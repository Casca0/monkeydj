const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Retoma a música atual.'),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue.node.isPaused()) {
			return interaction.followUp({ content: 'O bot não está pausado ou não está tocando música!', ephemeral: true });
		}

		const paused = queue.node.resume();

		return interaction.followUp({ content: paused ? 'Música retomada.' : 'Algo deu errado!' });
	},
};
