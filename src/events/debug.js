module.exports = {
	name: 'debug',
	music: true,
	execute(queue, message) {
		console.log(`[DEBUG] ${queue.guild.id} ${message}`);
	},
};
