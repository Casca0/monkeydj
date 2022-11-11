const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Limpa a fila de música.'),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue) {
			return await interaction.reply({ content: 'Nenhuma música na fila!', ephemeral: true });
		}
		queue.clear();
		return await interaction.reply({ content: 'Fila de músicas excluída!' });
	},
};
