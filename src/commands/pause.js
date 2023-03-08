const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pausa a música atual.'),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const paused = queue.node.pause();

		return await interaction.reply({ content: paused ? 'Música pausada.' : 'Algo deu errado!' });
	},
};
