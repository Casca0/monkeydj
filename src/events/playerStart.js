const { EmbedBuilder } = require('discord.js');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	name: 'playerStart',
	music: true,
	async execute(queue, track) {
		if (queue.metadata.dashboard) {
			const message = await queue.metadata.dashboard.messages.fetch();
			const embed = message.find(msg => msg.content === '').embeds[0];

			const musicEmbed = EmbedBuilder.from(embed);

			musicEmbed.setTitle('Tocando agora');
			musicEmbed.setDescription(`**[${track.title}](${track.url})** - ${track.author}`);
			musicEmbed.setThumbnail(track.thumbnail);
			musicEmbed.setFields({
				name: 'Próxima música',
				value: queue.tracks.data[0] ? `**[${queue.tracks.data[0].title}](${queue.tracks.data[0].url})** - ${queue.tracks.data[0].author}` : 'Não tem.',
			});

			message.find(msg => msg.content === '').edit({
				embeds: [musicEmbed],
				components: [buttonRow],
			});
		}

		queue.metadata.channel.send(`TOCANDO AGORA **${track.title}**!`);
	},
};
