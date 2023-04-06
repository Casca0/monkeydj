module.exports = {
	name: 'error',
	music: true,
	execute(queue, error) {
		console.log(`Erro geral do player ${error}`);
		console.error(error);
	},
};
