module.exports = {
	name: 'trackStart',
	music: true,
	execute(queue, track) {
		queue.metadata.channel.send(`TOCANDO AGORA **${track.title}**!`);
	},
};
