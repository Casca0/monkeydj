const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { useMasterPlayer } = require('discord-player');

const { buttonRow } = require('../utils/dashboardComponents');

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
			return interaction.reply({ content: 'Entre num canal de voz primeiro.' });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return interaction.reply({ content: 'Não estamos no mesmo canal de voz.' });
		}

		const player = useMasterPlayer();

		const query = interaction.options.getString('query');

		const searchResult = await player.search(query, {
			fallbackSearchEngine: 'spotifySearch',
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		if (!searchResult.hasTracks()) return interaction.reply('Não encontrei a música.');

		const findDashboard = await interaction.guild.channels.cache.find(c => c.name == 'monkeydj-dashboard');

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
				dashboard: findDashboard,
				channel: interaction.channel,
			},
		});

		try {
			if (!queue.connection) await queue.connect(channel);
		}
		catch (e) {
			console.error(e);
			queue.delete();
			return interaction.reply(`Ocorreu um erro ao me conectar no canal: ${e}`);
		}

		await interaction.deferReply();

		await interaction.followUp({ content: `Carregando a ${searchResult.playlist ? `playlist **${searchResult.playlist.title}**` : `música **${searchResult.tracks[0].title}**`}` });

		if (searchResult.playlist) {
			queue.addTrack(searchResult.tracks);
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
				if (queue.metadata.dashboard) {
					if (queue.tracks.data.length === 1) {
						const message = await queue.metadata.dashboard.messages.fetch();
						const embed = message.find(msg => msg.content === '').embeds[0];

						const musicEmbed = EmbedBuilder.from(embed);

						musicEmbed.setFields({
							name: 'Próxima música',
							value: queue.tracks.data[0] ? `**[${queue.tracks.data[0].title}](${queue.tracks.data[0].url})** - ${queue.tracks.data[0].author}` : 'Não tem.',
						});

						message.find(msg => msg.content === '').edit({
							embeds: [musicEmbed],
							components: [buttonRow],
						});
					}
				}
				return;
			}
		}
		catch (e) {
			console.error(e);
			return interaction.followUp(`Ocorreu o seguinte erro : ${e}`);
		}

	},
};
