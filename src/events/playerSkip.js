module.exports = {
	name: 'playerSkip',
	music: true,
	execute(queue, track) {
		queue.metadata.send(`Pulando **${track.title}** devido ao um erro!`);
	},
};
