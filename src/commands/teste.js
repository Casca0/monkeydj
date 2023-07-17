const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('teste')
		.setDescription('Comando para testes no bot! (ADM)')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		return interaction.reply('Teste');
	},
};
