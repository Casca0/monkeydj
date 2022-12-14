const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Pula para uma música específica na fila.')
		.addIntegerOption((option) =>
			option.setName('músicas')
				.setDescription('Número de músicas para pular da fila.')
				.setRequired(true)),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const indexOption = interaction.options.getInteger('músicas');

		const trackIndex = indexOption - 1;

		const trackName = queue.tracks[trackIndex].title;
		queue.jump(trackIndex);

		return await interaction.reply({ content: `Pulando para **${trackName}**.` });
	},
};
