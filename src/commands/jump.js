const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player/dist');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Pula para uma música específica na fila.')
		.addIntegerOption((option) =>
			option.setName('músicas')
				.setDescription('Número de músicas para pular da fila.')
				.setRequired(true)),
	execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) {
			return interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const indexOption = interaction.options.getInteger('músicas');

		const trackIndex = indexOption - 1;

		const trackName = queue.tracks.store[trackIndex].title;

		try {
			queue.node.skipTo(trackIndex);
		}
		catch (err) {
			console.log(err);
			return interaction.reply(`Ocorreu o seguinte erro ao pular de música : ${err}`);
		}
		return interaction.reply({ content: `Pulando para **${trackName}**.` });
	},
};
