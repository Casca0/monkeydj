const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Embaralha a fila de música.'),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		await queue.shuffle();

		await interaction.deferReply();

		return await interaction.followUp({ content: 'Fila embaralhada!', ephemeral: true });
	},
};
