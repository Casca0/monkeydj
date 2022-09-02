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

		const progress = queue.createProgressBar();
		const perc = queue.getPlayerTimestamp();

		await interaction.deferReply();

		return await interaction.followUp({ embeds: [
			{
				title: 'Tocando agora',
				description: `🎶 | **${queue.current.title}**! (\`${perc.progress == 'Infinity' ? 'Ao vivo' : perc.progress + '%'}\`)`,
				fields: [
					{
						name: '\u200b',
						value: progress.replace(/ 0:00/g, ' ◉ AO VIVO'),
					},
				],
				color: 0xffffff,
			},
		] });
	},
};
