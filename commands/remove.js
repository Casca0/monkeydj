const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove uma música específica da fila.')
		.addIntegerOption((option) =>
			option.setName('música')
				.setDescription('Número da música na fila.')
				.setRequired(true)),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const indexOption = interaction.options.getInteger('música');

		const trackIndex = indexOption - 1;

		const trackName = queue.tracks[trackIndex].title;
		queue.remove(trackIndex);

		return await interaction.reply({ content: `Música removida (**${trackName}**).` });
	},
};
