const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Envie uma URL para tocar música.')
		.addStringOption((option) =>
			option.setName('query')
				.setDescription('URL ou nome da música.')
				.setRequired(true)),
	async execute(interaction, player) {
		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'Entre num canal de voz primeiro.' });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ content: 'Não estamos no mesmo canal de voz.' });
		}

		const query = interaction.options.getString('query');

		const searchResult = await player.search(query, {
			requestedBy: interaction.user,
			searchEngine: 'auto',
		}).catch((err) => {
			console.log(err);
		});

		if (searchResult.tracks == [] || searchResult.tracks[0] == undefined) return await interaction.reply({ content: 'Não encontrei a música.' });

		const queue = player.nodes.create(interaction.guild, {
			volume: false,
			disableHistory: true,
			leaveOnEmpty: true,
			leaveOnEmptyCooldown: 300000,
			leaveOnEnd: true,
			leaveOnEndCooldown: 300000,
			selfDeaf: true,
			skipOnNoStream: true,

			metadata: {
				channel: interaction.channel,
			},
		});

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch (err) {
			console.log(err);
			queue.delete();
			return await interaction.reply({ content: 'Não consegui me conectar ao canal.' });
		}

		await interaction.reply({ content: `Carregando a ${searchResult.playlist ? `playlist **${searchResult.playlist.title}**` : `música **${searchResult.tracks[0].title}**`}` });

		searchResult.playlist ? queue.addTrack(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

		try {
			if (!queue.node.isPlaying()) {
				await queue.node.play();
				await interaction.followUp('Player iniciado.');
			}
			else {
				return;
			}
		}
		catch (err) {
			console.log(err);
			await interaction.followUp('Não foi possível iniciar o player.');
		}

	},
};
