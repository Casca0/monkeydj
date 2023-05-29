const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const { dashboardEmbed, buttonRow } = require('../utils/dashboardComponents.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dashboard')
		.setDescription('Cria um dashboard para o server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const findDashboard = await interaction.guild.channels.cache.find(channel => channel.name == 'monkeydj-dashboard');

		if (findDashboard) return interaction.reply('Dashboard já existe.');

		const channel = await interaction.guild.channels.create({
			name: 'monkeydj-dashboard',
		});

		channel.send({ embeds: [dashboardEmbed], components: [buttonRow] });

		return interaction.reply('Dashboard criado.');
	},
};
