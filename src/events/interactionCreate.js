module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		await interaction.deferReply();

		try {
			await command.execute(interaction);
		}
		catch (e) {
			console.error(e);
			return await interaction.followUp(`Ocorreu um erro : ${e}`);
		}
	},
};
