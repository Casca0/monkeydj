const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ComponentType, ActionRowBuilder, ButtonStyle } = require('discord.js');

const { useMasterPlayer } = require('discord-player/dist');

const { playlistModel } = require('../models/playlistModel.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Comandos relacionados a playlist do servidor.')
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('criar')
				.setDescription('Criar uma playlist')
				.addStringOption(option =>
					option
						.setName('nome')
						.setDescription('Nome da playlist')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('adicionar')
				.setDescription('Adiciona uma música à playlist.')
				.addStringOption(option =>
					option
						.setName('playlist')
						.setDescription('Em qual playlist adicionar a música.')
						.setRequired(true)
						.setAutocomplete(true),
				)
				.addStringOption(option =>
					option
						.setName('query')
						.setDescription('URL ou nome da música.')
						.setRequired(true)
						.setAutocomplete(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remover')
				.setDescription('Remover uma música da sua playlist.')
				.addStringOption(option =>
					option
						.setName('playlist')
						.setDescription('Nome da playlist onde vai remover a música.')
						.setRequired(true)
						.setAutocomplete(true),
				)
				.addStringOption(option =>
					option
						.setName('musica')
						.setDescription('Música para remover.')
						.setRequired(true)
						.setAutocomplete(true),
				),
		),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);

		if (focusedOption.name === 'playlist') {
			const playlists = await playlistModel.find({ user_id: interaction.user.id });

			const results = playlists.slice(0, playlists.length).map((p) => ({
				name: p.playlist_name,
				value: p.playlist_name,
			}));

			await interaction.respond(
				results,
			);
		}

		if (focusedOption.name === 'query') {
			const player = useMasterPlayer();
			const query = interaction.options.getString('query');
			const results = await player.search(query, {
				fallbackSearchEngine: 'spotifySearch',
				searchEngine: 'youtubeSearch',
			});

			const tracks = results.tracks.slice(0, results.tracks.length).map((t) => ({
				name: t.title,
				value: t.url,
			}));

			await interaction.respond(
				tracks,
			);
		}

		if (focusedOption.name === 'musica') {
			const playlistName = interaction.options.getString('playlist');
			const playlist = await playlistModel.findOne({ playlist_name: playlistName });

			const results = playlist.playlist_tracks.slice(0, playlist.playlist_tracks.length).map((t, index) => ({
				name: t.title,
				value: `${index}`,
			}));

			await interaction.respond(
				results,
			);
		}
	},
	async execute(interaction) {
		const player = useMasterPlayer();

		const command = interaction.options.getSubcommand();

		if (command === 'criar') {
			const playlistName = interaction.options.getString('nome');

			await playlistModel.create({
				playlist_name: playlistName,
				user_id: interaction.user.id,
			});

			return interaction.reply('Playlist criada!');
		}

		if (command === 'adicionar') {
			const query = interaction.options.getString('query');
			const playlistName = interaction.options.getString('playlist');

			const playlist = await playlistModel.findOne({
				playlist_name: playlistName,
			});

			if (!playlist) return interaction.reply('Não encontrei a playlist.');

			const searchResult = await player.search(query, {
				searchEngine: 'auto',
			}).then(res => res.toJSON());

			if (searchResult.playlist) return interaction.reply('Não aceito links de playlist!');

			if (searchResult.tracks.length == 0) return interaction.reply({ content: 'Não encontrei a música.', ephemeral: true });

			const trackEmbed = new EmbedBuilder({
				title: 'É essa música?',
				description: `**[${searchResult.tracks[0].title}](${searchResult.tracks[0].url}) - ${searchResult.tracks[0].author}**`,
				thumbnail: {
					url: searchResult.tracks[0].thumbnail,
				},
				color: 0x4287f5,
			});

			const okayButton = new ButtonBuilder({
				style: ButtonStyle.Success,
				label: 'É ESSA',
				emoji: '👍',
				customId: 'okay',
			});
			const backButton = new ButtonBuilder({
				style: ButtonStyle.Danger,
				label: 'NÃO É',
				emoji: '👎',
				customId: 'back',
			});

			const interactionReply = await interaction.reply({ embeds: [trackEmbed], components: [new ActionRowBuilder({
				components: [okayButton, backButton],
			})] });

			const buttonCollector = interactionReply.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			buttonCollector.on('collect', async intr => {
				if (intr.user.id != interaction.user.id) return;

				if (intr.customId == 'okay') {
					playlist.playlist_tracks.push(searchResult.tracks[0]);
					playlist.save();

					const embed = new EmbedBuilder({
						title: 'Música adicionada à playlist',
						description: `**[${searchResult.tracks[0].title}](${searchResult.tracks[0].url}) - ${searchResult.tracks[0].author}**`,
						thumbnail: {
							url: searchResult.tracks[0].thumbnail,
						},
						color: 0x42f5ad,
					});

					return intr.update({ embeds: [embed], components: [] });
				}

				if (intr.customId == 'back') {
					return intr.update({ content: 'Okay, pesquise novamente!', embeds: [], components: [] });
				}
			});
		}

		if (command == 'remover') {
			const playlistName = interaction.options.getString('playlist');
			const musicIndex = parseInt(interaction.options.getString('musica'));

			const playlist = await playlistModel.findOne({ playlist_name: playlistName });

			if (!playlist) return interaction.reply('Não encontrei a playlist!');

			const track = playlist.playlist_tracks[musicIndex];

			if (!track) return interaction.reply('Não existe essa música na sua playlist.');

			const trackEmbed = new EmbedBuilder({
				title: 'Tem certeza que quer remover essa música?',
				description: `**[${track.title}](${track.url}) - ${track.author}**`,
				thumbnail: {
					url: track.thumbnail,
				},
				color: 0xff0000,
			});

			const okayButton = new ButtonBuilder({
				style: ButtonStyle.Success,
				label: 'Sim',
				customId: 'okay',
			});
			const backButton = new ButtonBuilder({
				style: ButtonStyle.Danger,
				label: 'Não',
				customId: 'back',
			});

			const interactionReply = await interaction.reply({ embeds: [trackEmbed], components: [new ActionRowBuilder({
				components: [okayButton, backButton],
			})] });

			const buttonCollector = interactionReply.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			buttonCollector.on('collect', async intr => {
				if (intr.user.id != interaction.user.id) return;

				if (intr.customId == 'okay') {
					playlist.playlist_tracks.splice(musicIndex, 1);
					playlist.save();

					return intr.update({ content: 'Música removida da playlist!', embeds: [], components: [] });
				}

				if (intr.customId == 'back') {
					return intr.update({ content: 'Okay, tente novamente!', embeds: [], components: [] });
				}
			});
		}
	},
};
