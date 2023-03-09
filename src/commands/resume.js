const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Retoma a música atual.'),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue.node.isPaused()) {
			return await interaction.reply({ content: 'O bot não está pausado ou não está tocando música!', ephemeral: true });
		}

		const paused = await queue.node.resume();

		return await interaction.reply({ content: paused ? 'Música retomada.' : 'Algo deu errado!' });
	},
};
