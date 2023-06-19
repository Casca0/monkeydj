const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player/dist');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pausa a música atual.'),
	execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const paused = queue.node.pause();

		return interaction.reply({ content: paused ? 'Música pausada.' : 'Algo deu errado!' });
	},
};
