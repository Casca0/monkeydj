const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula para a próxima música.'),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const currentTrack = queue.currentTrack;
		const success = queue.node.skip();

		return interaction.followUp({ content: success ? `Pulando a música atual (**${currentTrack}**)` : 'Algo deu errado!' });
	},
};
