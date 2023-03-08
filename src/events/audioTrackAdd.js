module.exports = {
	name: 'audioTrackAdd',
	music: true,
	execute(queue, track) {
		const trackCard = {
			title: 'Música adicionada a fila!',
			description: `**[${track.title}](${track.url}) - ${track.author}**`,
			thumbnail: {
				url: track.thumbnail,
			},
			color: 0x4feb34,
		};
		queue.metadata.channel.send({ embeds: [trackCard] });
	},
};
