const { EmbedBuilder } = require('discord.js');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	name: 'emptyQueue',
	music: true,
	async execute(queue) {
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
	},
};
