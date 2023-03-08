const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Embaralha a fila de música.'),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		await queue.tracks.shuffle();

		return await interaction.reply({ content: 'Fila embaralhada!' });
	},
};
