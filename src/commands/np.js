const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('np')
		.setDescription('Mostra a música que está tocando atualmente.'),
	async execute(interaction, player) {
		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		return await interaction.reply({ embeds: [
			{
				title: 'Tocando agora',
				description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.author}`,
				fields: [{
					name: 'Requisitado por',
					value: `${queue.current.requestedBy}`,
				}],
				thumbnail: {
					url: queue.current.thumbnail,
				},
				color: 0x4D3A81,
			},
		] });
	},
};
