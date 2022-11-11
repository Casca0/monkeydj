module.exports = {
	name: 'tracksAdd',
	music: true,
	execute(queue, track) {
		const page = 1;
		const pageStart = 10 * (page - 1);
		const pageEnd = pageStart + 10;

		const tracks = track.slice(pageStart, pageEnd).map((m, i) => {
			return `${i + pageStart + 1}. **[${m.title}](${m.url}) - ${m.author}**`;
		});

		const trackCard = {
			title: 'Músicas adicionadas a fila!',
			description: `${tracks.join('\n')}${
				queue.tracks.length > pageEnd ?
					`\n...${queue.tracks.length - pageEnd} mais música(s)` :
					''
			}`,
			color: 0x4feb34,
		};
		queue.metadata.channel.send({ embeds: [trackCard] });
	},
};
