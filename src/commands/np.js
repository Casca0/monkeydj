const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('np')
		.setDescription('Mostra a música que está tocando atualmente.'),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		return await interaction.reply({ embeds: [
			{
				title: 'Tocando agora',
				description: `**[${queue.currentTrack.title}](${queue.currentTrack.url})** - ${queue.currentTrack.author}`,
				fields: [{
					name: 'Requisitado por',
					value: `${queue.currentTrack.requestedBy}`,
				}],
				thumbnail: {
					url: queue.currentTrack.thumbnail,
				},
				color: 0x4D3A81,
			},
		] });
	},
};
