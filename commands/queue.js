const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Mostra a fila de música atual.')
		.addIntegerOption((option) =>
			option.setName('página')
				.setDescription('Número da página da fila.')
				.setRequired(false)),
	async execute(interaction, player) {
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guild.id);
		let page = interaction.options.getInteger('página');

		if (!queue || !queue.playing) {
			return await interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		if (!page) page = 1;

		const pageStart = 10 * (page - 1);
		const pageEnd = pageStart + 10;

		const currentTrack = queue.current;

		const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
			return `${i + pageStart + 1}. **${m.title}** ([link](${m.url}))`;
		});

		return await interaction.followUp({ embeds: [{
			title: 'Fila do servidor',
			description: `${tracks.join('\n')}${
				queue.tracks.length > pageEnd ?
					`\n...${queue.tracks.length - pageEnd} mais música(s)` :
					''
			}`,
			color: 0xff0000,
			fields: [{ name: '🎶 | Tocando agora', value: `**${currentTrack.title}** ([link](${currentTrack.url}))` }],
		}] });
	},
};
