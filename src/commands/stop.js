const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Interrompe o player de música.'),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		if (!queue.deleted) queue.delete();

		return interaction.followUp({ content: 'Player Parado!' });
	},
};
