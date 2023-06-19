const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player/dist');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Retoma a música atual.'),
	execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (!queue.node.isPaused()) {
			return interaction.reply({ content: 'O bot não está pausado ou não está tocando música!', ephemeral: true });
		}

		const paused = queue.node.resume();

		return interaction.reply({ content: paused ? 'Música retomada.' : 'Algo deu errado!' });
	},
};
