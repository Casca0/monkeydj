// const { useMainPlayer } = require('discord-player');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// const player = useMainPlayer();

		console.log(`Ready! Logged in as ${client.user.tag}`);

		// player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
	},
};
