module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, player) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, player);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Ocorreu um erro ao tentar executar o comando!', ephemeral: true });
		}
	},
};
