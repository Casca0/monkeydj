const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('radio')
		.setDescription('Ativa ou desativa a função de rádio.'),
	execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);

		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		if (queue.repeatMode === 3) {
			queue.setRepeatMode(0);

			return interaction.followUp('Rádio desativado!');
		}
		else {
			queue.setRepeatMode(3);

			return interaction.followUp('Rádio ativado!');
		}
	},
};
