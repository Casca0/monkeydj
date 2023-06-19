const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ajuda')
		.setDescription('Comando introdutório ao bot!'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder({
			title: 'Bem-vindo(a) ao Monkey DJ!',
			fields: [
				{
					name: 'Como tocar música',
					value: 'É um processo muito simples, basta utilizar o comando `/play` e preencher o espaço necessário com a URL ou nome de uma música, ele também faz uma pesquisa baseado nisso e te mostra os resultados!',
				},
				{
					name: 'Quaisquer dúvidas',
					value: 'Basta chamar meu desenvolvedor, <@380198082811396097>.',
				},
			],
			thumbnail: {
				url: interaction.client.user.avatarURL({ dynamic: true }),
			},
			color: 0xeb4034,
		});

		return interaction.reply({ embeds: [helpEmbed] });
	},
};
