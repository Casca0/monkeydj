module.exports = {
	name: 'trackStart',
	music: true,
	once: true,
	execute(queue, track) {
		queue.metadata.channel.send(`TOCANDO AGORA **${track.title}**!`);
	},
};
