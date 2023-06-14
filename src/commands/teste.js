const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

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
	async execute(interaction) {
		const player = useMasterPlayer();

		const query = interaction.options.getString('query');

		const searchResult = await player.search(query, {
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		console.log(searchResult);

		return interaction.reply('Teste');
	},
};
