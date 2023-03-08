module.exports = {
	name: 'playerStart',
	music: true,
	execute(queue, track) {
		queue.metadata.channel.send(`TOCANDO AGORA **${track.title}**!`);
	},
};
