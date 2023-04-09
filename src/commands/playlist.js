const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ComponentType, ActionRowBuilder, ButtonStyle } = require('discord.js');

const { Track, useMasterPlayer } = require('discord-player');

const PocketBase = require('pocketbase/cjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Comandos relacionados a playlist do servidor.')
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('adicionar')
				.setDescription('Adiciona uma música à playlist.')
				.addStringOption(option =>
					option
						.setName('query')
						.setDescription('URL ou nome da música.')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ver')
				.setDescription('Veja as músicas que você colocou ou que outro membro colocou.')
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('O user para pesquisar, pode ser você mesmo!'),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('tocar')
				.setDescription('Toque a playlist geral ou de algum membro (pode selecionar si mesmo).')
				.addStringOption(option =>
					option
						.setName('modo')
						.setDescription('Selecione se você quer tocar a playlist de alguém ou a global.')
						.setChoices(
							{ name: 'Global', value: 'global' },
							{ name: 'User', value: 'user' },
						)
						.setRequired(true),
				)
				.addUserOption(option =>
					option
						.setName('user')
						.setDescription('O user para pesquisar, deixe vazio para ser você!'),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remover')
				.setDescription('Remover uma música da sua playlist.')
				.addIntegerOption(option =>
					option
						.setName('index')
						.setDescription('Posição da música na playlist.')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const player = useMasterPlayer();

		const pb = new PocketBase('https://monkeydj.pockethost.io');

		const command = interaction.options.getSubcommand();

		async function searchDuplicate(songTitle) {
			try {
				await pb.collection('serverplaylist').getFirstListItem(`track.title="${songTitle}"`);

				return true;
			}
			catch (e) {
				console.log(`Não encontrei : ${e}`);
				return false;
			}
		}


		if (command == 'adicionar') {
			const query = interaction.options.getString('query');

			const searchResult = await player.search(query, {
				searchEngine: 'auto',
			}).then(res => res.toJSON()).catch((err) => {
				console.log(err);
			});


			if (searchResult.playlist) return interaction.followUp('Não aceito links de playlist!');

			if (searchResult.tracks.length == 0) return interaction.followUp({ content: 'Não encontrei a música.', ephemeral: true });

			const getDuplicate = await searchDuplicate(searchResult.tracks[0].title);

			if (getDuplicate) return interaction.followUp({ content: 'Está música já existe na playlist!', ephemeral: true });

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

			const interactionReply = await interaction.followUp({ embeds: [trackEmbed], components: [new ActionRowBuilder({
				components: [okayButton, backButton],
			})] });

			const buttonCollector = interactionReply.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			buttonCollector.on('collect', async intr => {
				if (intr.user.id != interaction.user.id) return;

				if (intr.customId == 'okay') {
					const data = {
						user_id: interaction.user.id,
						track: searchResult.tracks[0],
					};

					try {
						await pb.collection('serverplaylist').create(data);

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
					catch (err) {
						console.log(err);
						return intr.update({ content: 'Ocorreu um erro ao adicionar a música na playlist.', embeds: [], components: [] });
					}
				}

				if (intr.customId == 'back') {
					return intr.update({ content: 'Okay, pesquise novamente!', embeds: [], components: [] });
				}
			});
		}

		if (command == 'ver') {
			const user = interaction.options.getUser('user');

			let getTracks;

			if (!user) {
				getTracks = await pb.collection('serverplaylist').getFullList();
			}
			else {
				getTracks = await pb.collection('serverplaylist').getFullList({
					filter: `user_id=${user.id}`,
				});
			}

			if (getTracks.length === 0) {
				return interaction.followUp('Não há músicas na playlist do server ou desse user!');
			}

			try {
				const tracks = getTracks.map(record => record.track);

				const backButton = new ButtonBuilder({
					style: ButtonStyle.Secondary,
					label: 'Voltar',
					emoji: '⬅️',
					customId: 'back',
				});

				const forwardButton = new ButtonBuilder({
					style: ButtonStyle.Secondary,
					label: 'Seguir',
					emoji: '➡️',
					customId: 'forward',
				});

				const generatePlaylistEmbed = async start => {
					const currentPage = tracks.slice(start, start + 5);

					return new EmbedBuilder({
						title: `Playlist do ${user ? user.username : 'servidor'}`,
						thumbnail: {
							url: user ? user.avatarURL({ dynamic: true }) : interaction.guild.iconURL({ dynamic: true }),
						},
						description: `**Total : ${tracks.length}**`,
						fields:
						await Promise.all(
							currentPage.map(async (track, index) => ({
								name: '\u200B',
								value: `**${index + start + 1} - [${track.title}](${track.url}) - ${track.author}**`,
							})),
						),
						color: 0xa834eb,
					});
				};

				const canFitInOnePage = tracks.length <= 5;

				const interactionReply = await interaction.followUp({
					embeds: [await generatePlaylistEmbed(0)],
					components: canFitInOnePage ? [] : [new ActionRowBuilder({
						components: [forwardButton],
					})],
				});

				if (canFitInOnePage) return;

				const buttonCollector = interactionReply.createMessageComponentCollector({
					componentType: ComponentType.Button,
				});

				let currentIndex = 0;

				buttonCollector.on('collect', async intr => {
					if (intr.user.id != interaction.user.id) return;

					intr.customId === 'back' ? (currentIndex -= 5) : (currentIndex += 5);

					return intr.update({
						embeds: [await generatePlaylistEmbed(currentIndex)],
						components: [
							new ActionRowBuilder({
								components: [
									...(currentIndex ? [backButton] : []),
									...(currentIndex + 5 < tracks.length ? [forwardButton] : []),
								],
							}),
						],
					});
				});
			}
			catch (err) {
				console.log(err);
				return interaction.followUp({ content: 'Ocorreu um erro ao tentar exibir a playlist.', ephemeral: true });
			}
		}

		if (command == 'tocar') {
			const mode = interaction.options.getString('modo');
			let user = interaction.options.getUser('user');
			let queue = player.nodes.get(interaction.guild.id);

			if (!queue) {
				queue = player.nodes.create(interaction.guild, {
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
			}

			if (mode == 'global') {
				try {
					const getTracks = await pb.collection('serverplaylist').getFullList();
					const tracks = getTracks.map(record => new Track(player, record.track));

					queue.addTrack(tracks);
					queue.tracks.shuffle();
					if (!queue.connection) await queue.connect(interaction.member.voice.channel);
				}
				catch (err) {
					console.log(err);
					queue.delete();
					return interaction.followUp({ content: 'Ocorreu um erro ao tentar tocar a playlist.', ephemeral: true });
				}

				interaction.followUp({ content: 'Carregando a playlist do servidor...' });

				if (!queue.node.isPlaying()) await queue.node.play();

				return interaction.followUp({ content: 'Playlist carregada!' });
			}

			if (!user) user = interaction.user;

			try {
				const getTracks = await pb.collection('serverplaylist').getFullList({
					filter: `user_id=${user.id}`,
				});

				if (getTracks.length === 0) {
					return interaction.followUp('Este user não tem uma playlist!');
				}

				const tracks = getTracks.map(record => new Track(player, record.track));

				queue.addTrack(tracks);
				queue.tracks.shuffle();

				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			}
			catch (err) {
				console.log(err);
				queue.delete();
				return interaction.followUp({ content: 'Ocorreu um erro ao tentar tocar a playlist.', ephemeral: true });
			}

			interaction.followUp({ content: `Carregando a playlist de ${user}...` });

			if (!queue.node.isPlaying()) return await queue.node.play();

			return interaction.followUp({ content: 'Playlist carregada!' });
		}

		if (command == 'remover') {
			const index = interaction.options.getInteger('index');

			const getTracks = await pb.collection('serverplaylist').getFullList({
				filter: `user_id=${interaction.user.id}`,
			});

			const track = getTracks[index - 1].track;

			if (!track) return interaction.followUp('Não existe essa música na sua playlist.');

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

			const interactionReply = await interaction.followUp({ embeds: [trackEmbed], components: [new ActionRowBuilder({
				components: [okayButton, backButton],
			})] });

			const buttonCollector = interactionReply.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			buttonCollector.on('collect', async intr => {
				if (intr.user.id != interaction.user.id) return;

				if (intr.customId == 'okay') {
					try {
						await pb.collection('serverplaylist').delete(`${getTracks[index - 1].id}`);

						return intr.update({ content: 'Música removida da playlist!', embeds: [], components: [] });
					}
					catch (err) {
						console.log(err);
						return intr.update({ content: 'Ocorreu um erro ao remover a música da playlist.', embeds: [], components: [] });
					}
				}

				if (intr.customId == 'back') {
					return intr.update({ content: 'Okay, tente novamente!', embeds: [], components: [] });
				}
			});
		}
	},
};
