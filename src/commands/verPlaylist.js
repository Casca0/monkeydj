const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { playlistModel } = require('../models/playlistModel.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('verplaylist')
		.setDescription('Ver uma playlist de algum usário.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('User para ver as playlists.')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('playlists')
				.setDescription('Selecione uma playlist.')
				.setAutocomplete(true)
				.setRequired(true),
		),
	async autocomplete(interaction) {
		const member = interaction.options.get('user').value;

		const playlists = await playlistModel.find({ user_id: member });

		const results = playlists.slice(0, playlists.length).map((p) => ({
			name: p.playlist_name,
			value: p.playlist_name,
		}));

		await interaction.respond(
			results,
		);
	},
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		const playlistName = interaction.options.getString('playlists');

		const playlist = await playlistModel.findOne({ playlist_name: playlistName });

		if (!playlist) return interaction.reply('Este user não tem esta playlist!');

		const tracks = playlist.playlist_tracks;

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
				title: playlist.playlist_name,
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

		const interactionReply = await interaction.reply({
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
	},
};
