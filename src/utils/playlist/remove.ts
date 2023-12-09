import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from 'discord.js';
import { SerializedTrack } from 'discord-player';

export async function handlePlaylistRemove({ interaction }: SlashCommandProps) {
	const playlistName = interaction.options.getString('playlist', true);
	const musicIndex = interaction.options.getInteger('musica', true);

	const playlist = await playlistModel.findOne({ playlist_name: playlistName });

	if (!playlist) return interaction.reply('Não encontrei a playlist!');

	let track: SerializedTrack;

	if (musicIndex >= 1) {
		track = playlist.playlist_tracks[musicIndex - 1];
	}
	else {
		track = playlist.playlist_tracks[0];
	}

	if (!track) return interaction.reply('Não encontrei a música na sua playlist.');

	await interaction.deferReply();

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

	const interactionReply = await interaction.editReply({ embeds: [trackEmbed], components: [new ActionRowBuilder<ButtonBuilder>({
		components: [okayButton, backButton],
	})] });

	const buttonCollector = interactionReply.createMessageComponentCollector({
		componentType: ComponentType.Button,
	});

	buttonCollector.on('collect', async (intr: { user: { id: string; }; customId: string; update: (arg0: { content: string; embeds: never[]; components: never[]; }) => never; }) => {
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
