import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder, AnyComponentBuilder } from 'discord.js';

export async function handlePlaylistSee({ interaction }: SlashCommandProps) {
	const user = interaction.options.getUser('membro', true);
	const playlistName = interaction.options.getString('playlists', true);

	const playlist = await playlistModel.findOne({ playlist_name: playlistName });

	if (!playlist) return interaction.reply('Este membro não possui essa playlist.');

	await interaction.deferReply();

	const playlistTracks = playlist.playlist_tracks;

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

	const generatePlaylistEmbed = async (start: number) => {
		const currentPage = playlistTracks.slice(start, start + 5);

		return new EmbedBuilder({
			title: playlist.playlist_name,
			thumbnail: {
				url: user ? user.displayAvatarURL() : interaction.guild!.iconURL()!,
			},
			description: `**Total : ${playlistTracks.length}**`,
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

	const canFitInOnePage = playlistTracks.length <= 5;

	const interactionReply = await interaction.editReply({
		embeds: [await generatePlaylistEmbed(0)],
		components: canFitInOnePage ? [] : [new ActionRowBuilder<ButtonBuilder>({
			components: [forwardButton],
		})],
	});

	if (canFitInOnePage) return;

	const buttonCollector = interactionReply.createMessageComponentCollector({
		componentType: ComponentType.Button,
	});

	let currentIndex = 0;

	buttonCollector.on('collect', async (intr: { user: { id: string; }; customId: string; update: (arg0: { embeds: EmbedBuilder[]; components: ActionRowBuilder<AnyComponentBuilder>[]; }) => never; }) => {
		if (intr.user.id != interaction.user.id) return;

		intr.customId === 'back' ? (currentIndex -= 5) : (currentIndex += 5);

		return intr.update({
			embeds: [await generatePlaylistEmbed(currentIndex)],
			components: [
				new ActionRowBuilder({
					components: [
						...(currentIndex ? [backButton] : []),
						...(currentIndex + 5 < playlistTracks.length ? [forwardButton] : []),
					],
				}),
			],
		});
	});
}
