const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Embaralha a fila de música.'),
	async execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		queue.tracks.shuffle();

		if (queue.metadata.dashboard) {
			const message = await queue.metadata.dashboard.messages.fetch();
			const embed = message.find(msg => msg.content === '').embeds[0];

			const musicEmbed = EmbedBuilder.from(embed);

			queue.tracks.shuffle();

			musicEmbed.setFields({
				name: 'Próxima música',
				value: queue.tracks.data[0] ? `**[${queue.tracks.data[0].title}](${queue.tracks.data[0].url})** - ${queue.tracks.data[0].author}` : 'Não tem.',
			});

			message.find(msg => msg.content === '').edit({
				embeds: [musicEmbed],
				components: [buttonRow],
			});
		}

		return interaction.reply({ content: 'Fila embaralhada!' });
	},
};
