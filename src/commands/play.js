const { SlashCommandBuilder } = require('discord.js');

const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Envie uma URL para tocar música.')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('URL ou nome da música.')
				.setRequired(true)
				.setAutocomplete(true),
		),
	async autocomplete(interaction) {
		const player = useMasterPlayer();
		const query = interaction.options.getString('query');
		const results = await player.search(query, {
			fallbackSearchEngine: 'spotifySearch',
			searchEngine: 'youtubeSearch',
		});

		const tracks = results.tracks.slice(0, 10).map((t) => ({
			name: t.title,
			value: t.url,
		}));

		await interaction.respond(
			tracks,
		);
	},
	async execute(interaction) {
		const channel = interaction.member.voice.channel;

		if (!interaction.member.voice.channelId) {
			return interaction.followUp({ content: 'Entre num canal de voz primeiro.' });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return interaction.followUp({ content: 'Não estamos no mesmo canal de voz.' });
		}

		const player = useMasterPlayer();

		const query = interaction.options.getString('query');

		const searchResult = await player.search(query, {
			fallbackSearchEngine: 'spotifySearch',
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		if (!searchResult.hasTracks()) return interaction.followUp('Não encontrei a música.');

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
			if (!queue.connection) await queue.connect(channel);
		}
		catch (e) {
			console.error(e);
			queue.delete();
			return interaction.followUp(`Ocorreu um erro ao me conectar no canal: ${e}`);
		}

		await interaction.followUp({ content: `Carregando a ${searchResult.playlist ? `playlist **${searchResult.playlist.title}**` : `música **${searchResult.tracks[0].title}**`}` });

		if (searchResult.playlist) {
			queue.addTrack(searchResult.tracks);
			queue.tracks.shuffle();
		}
		else {
			queue.addTrack(searchResult.tracks[0]);
		}

		try {
			if (!queue.node.isPlaying()) {
				await queue.node.play();
				return interaction.followUp('Player iniciado.');
			}
			else {
				return;
			}
		}
		catch (e) {
			console.error(e);
			return interaction.followUp(`Ocorreu o seguinte erro : ${e}`);
		}

	},
};
