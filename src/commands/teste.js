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

		const queue = player.nodes.get(interaction.guild.id);

		console.log(queue.repeatMode);

		return interaction.reply('Teste');
	},
};
