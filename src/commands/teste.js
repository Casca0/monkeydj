const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('teste')
		.setDescription('Comando para testes no bot! (ADM)')
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('Query da música'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, player) {
		const query = interaction.options.getString('query');

		const searchResult = await player.search(query, {
			searchEngine: 'auto',
		}).then(res => res.toJSON()).catch((err) => {
			console.log(err);
		});

		console.log(searchResult);

		return await interaction.reply('Teste');
	},
};
