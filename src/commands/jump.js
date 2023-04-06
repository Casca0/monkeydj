const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Pula para uma música específica na fila.')
		.addIntegerOption((option) =>
			option.setName('músicas')
				.setDescription('Número de músicas para pular da fila.')
				.setRequired(true)),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const indexOption = interaction.options.getInteger('músicas');

		const trackIndex = indexOption - 1;

		const trackName = queue.tracks.store[trackIndex].title;

		try {
			queue.node.skipTo(trackIndex);
		}
		catch (err) {
			console.log(err);
			return interaction.followUp(`Ocorreu o seguinte erro ao pular de música : ${err}`);
		}
		return interaction.followUp({ content: `Pulando para **${trackName}**.` });
	},
};
