const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Interrompe o player de música.'),
	async execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		if (queue.metadata.dashboard) {
			const message = await queue.metadata.dashboard.messages.fetch();
			const embed = message.find(msg => msg.content === '').embeds[0];

			const musicEmbed = EmbedBuilder.from(embed);

			musicEmbed.setTitle('Nenhuma música está tocando');
			musicEmbed.setDescription(null);
			musicEmbed.setThumbnail(null);
			musicEmbed.setFields({
				name: '\u200b',
				value: '\u200b',
			});

			message.find(msg => msg.content === '').edit({
				embeds: [musicEmbed],
				components: [buttonRow],
			});
		}

		if (!queue.deleted) queue.delete();

		return interaction.followUp({ content: 'Player Parado!' });
	},
};
