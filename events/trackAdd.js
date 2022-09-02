module.exports = {
	name: 'trackAdd',
	music: true,
	execute(queue, track) {
		const trackCard = {
			title: 'Música adicionada a fila!',
			description: `**${track.title} - ${track.author}** ([link](${track.url}))`,
			image: {
				url: track.thumbnail,
			},
			color: 0x4feb34,
		};
		queue.metadata.channel.send({ embeds: [trackCard] });
	},
};
