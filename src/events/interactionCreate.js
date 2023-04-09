module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.autocomplete(interaction);
			}
			catch (e) {
				console.error(e);
				return interaction.followUp(`Ocorreu um erro\n${e}`);
			}
		}
		else if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			await interaction.deferReply();

			try {
				await command.execute(interaction);
			}
			catch (e) {
				console.error(e);
				return await interaction.followUp(`Ocorreu um erro\n${e}`);
			}
		}
		else if (interaction.isUserContextMenuCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			await interaction.deferReply();

			try {
				await command.execute(interaction);
			}
			catch (e) {
				console.error(e);
				return await interaction.followUp(`Ocorreu um erro\n${e}`);
			}
		}
	},
};
