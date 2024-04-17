import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import { useMainPlayer, serialize, Track, SerializedTrack } from 'discord-player';
import { ButtonStyle, ButtonBuilder, EmbedBuilder, ActionRowBuilder, ComponentType } from 'discord.js';

export async function handlePlaylistAdd({ interaction }: SlashCommandProps) {
	const player = useMainPlayer();
	const query = interaction.options.getString('query', true);
	const playlistName = interaction.options.getString('sua_playlist', true);

	const playlist = await playlistModel.findOne({
		playlist_name: playlistName,
	});

	if (!playlist) return interaction.reply('Não encontrei a playlist');

	await interaction.deferReply();

	const result = await player.search(query, {
		searchEngine: 'youtube',
		requestedBy: interaction.user,
	});

	if (!result.tracks.length) return interaction.editReply('Não encontrei a música ou playlist informada.');

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

	if (result.playlist) {
		const serializedTracks: SerializedTrack[] = result.playlist.tracks.map((track: Track) => serialize(track));

		const playlistEmbed = new EmbedBuilder({
			title: 'É essa playlist?',
			description: `**[${result.playlist.title}](${result.playlist.url})**`,
			thumbnail: {
				url: result.playlist.thumbnail,
			},
			color: 0x4287f5,
		});

		const interactionReply = await interaction.editReply({ embeds: [playlistEmbed], components: [new ActionRowBuilder<ButtonBuilder>({
			components: [okayButton, backButton],
		})] });

		const buttonCollector = interactionReply.createMessageComponentCollector({
			componentType: ComponentType.Button,
		});

		buttonCollector.on('collect', async (intr: { user: { id: string; }; customId: string; update: (arg0: { embeds: EmbedBuilder[] | never[]; components: never[]; content?: string; }) => never; }) => {
			if (intr.user.id != interaction.user.id) return;

			if (intr.customId === 'okay') {
				playlist.playlist_tracks.push(...serializedTracks);
				playlist.save();

				const embed = new EmbedBuilder({
					title: 'Músicas adicionadas à playlist',
					description: `**[${result.playlist!.title}](${result.playlist!.url}) - ${result.tracks.length} músicas**`,
					thumbnail: {
						url: result.playlist!.thumbnail,
					},
					color: 0x42f5ad,
				});

				return intr.update({ embeds: [embed], components: [] });
			}

			if (intr.customId === 'back') {
				return intr.update({ content: 'Okay, pesquise novamente!', embeds: [], components: [] });
			}
		});
	}
	else {
		const serializedTrack: SerializedTrack = serialize(result.tracks[0]);

		const trackEmbed = new EmbedBuilder({
			title: 'É essa música?',
			description: `**[${result.tracks[0].title}](${result.tracks[0].url}) - ${result.tracks[0].author}**`,
			thumbnail: {
				url: result.tracks[0].thumbnail,
			},
			color: 0x4287f5,
		});

		const interactionReply = await interaction.editReply({ embeds: [trackEmbed], components: [new ActionRowBuilder<ButtonBuilder>({
			components: [okayButton, backButton],
		})] });

		const buttonCollector = interactionReply.createMessageComponentCollector({
			componentType: ComponentType.Button,
		});

		buttonCollector.on('collect', async (intr: { user: { id: string; }; customId: string; update: (arg0: { embeds: EmbedBuilder[] | never[]; components: never[]; content?: string; }) => never; }) => {
			if (intr.user.id != interaction.user.id) return;

			if (intr.customId === 'okay') {
				playlist.playlist_tracks.push(serializedTrack);
				playlist.save();

				const embed = new EmbedBuilder({
					title: 'Música adicionada à playlist',
					description: `**[${result.tracks[0].title}](${result.tracks[0].url}) - ${result.tracks[0].author}**`,
					thumbnail: {
						url: result.tracks[0].thumbnail,
					},
					color: 0x42f5ad,
				});

				return intr.update({ embeds: [embed], components: [] });
			}

			if (intr.customId === 'back') {
				return intr.update({ content: 'Okay, pesquise novamente!', embeds: [], components: [] });
			}
		});
	}
}
