const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove uma música específica da fila.')
		.addIntegerOption((option) =>
			option.setName('música')
				.setDescription('Número da música na fila.')
				.setRequired(true)),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue) {
			return interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const indexOption = interaction.options.getInteger('música');

		const trackIndex = indexOption - 1;

		const trackName = queue.tracks.store[trackIndex].title;
		queue.removeTrack(trackIndex);

		return interaction.reply({ content: `Música removida (**${trackName}**).` });
	},
};
