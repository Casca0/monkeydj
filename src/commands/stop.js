const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Interrompe o player de música.'),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		if (!queue.deleted) queue.delete();

		return await interaction.reply({ content: 'Player Parado!' });
	},
};
