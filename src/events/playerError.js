module.exports = {
	name: 'playerError',
	music: true,
	execute(queue, error) {
		console.log(`Erro do player ${error}`);
		console.error(error);
	},
};
