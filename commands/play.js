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
			return await interaction.reply({ content: 'Entre num canal de voz primeiro.', ephemeral: true });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ content: 'Não estamos no mesmo canal de voz.', ephemeral: true });
		}

		const query = interaction.options.getString('query');

		const searchResult = await player.search(query, {
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		if (!searchResult) return await interaction.reply({ content: `Não encontrei a música (**${query}**).`, ephemeral: true });

		const queue = player.createQueue(interaction.guild, {
			ytdlOptions: {
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			leaveOnEnd: false,
			metadata: {
				channel: interaction.channel,
			},
		});

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.reply({ content: 'Não consegui me conectar ao canal.', ephemeral: true });
		}

		await interaction.deferReply();

		await interaction.followUp({ content: `Carregando a ${searchResult.playlist ? `playlist **${searchResult.playlist.title}**` : `música **${searchResult.tracks[0].title}**`}` });

		searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

		if (!queue.playing) await queue.play();
	},
};
