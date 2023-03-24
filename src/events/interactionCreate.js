module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, player) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, player);
		}
		catch {
			console.error;
			if (interaction.deferred) return await interaction.followUp('Ocorreu um erro ao tentar executar o comando.');
			return await interaction.reply('Ocorreu um erro ao tentar executar o comando!');
		}
	},
};
