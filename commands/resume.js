const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Retoma a música atual.'),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const paused = queue.setPaused(false);

		return await interaction.reply({ content: paused ? 'Música retomada.' : 'Algo deu errado!' });
	},
};
