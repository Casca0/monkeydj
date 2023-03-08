const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula para a próxima música.'),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const currentTrack = queue.currentTrack;
		const success = queue.node.skip();

		return await interaction.reply({ content: success ? `Pulando a música atual (**${currentTrack}**)` : 'Algo deu errado!' });
	},
};
