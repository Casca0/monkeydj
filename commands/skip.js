const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula para a próxima música.'),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const currentTrack = queue.current;
		const success = queue.skip();

		await interaction.deferReply();

		return await interaction.followUp({ content: success ? `Pulando a música atual (**${currentTrack}**)` : 'Algo deu errado!' });
	},
};
