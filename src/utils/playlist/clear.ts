import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import {
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
	ComponentType,
} from 'discord.js';

export async function handlePlaylistClear({ interaction }: SlashCommandProps) {
	const playlistName = interaction.options.getString('sua_playlist', true);

	const playlist = await playlistModel.findOne({
		playlist_name: playlistName,
		user_id: interaction.user.id,
	});

	if (!playlist) return interaction.reply('Não encontrei a playlist!');

	await interaction.deferReply();

	const trueButton = new ButtonBuilder({
		style: ButtonStyle.Success,
		label: 'Sim',
		customId: 'true',
	});

	const falseButton = new ButtonBuilder({
		style: ButtonStyle.Danger,
		label: 'Não',
		customId: 'false',
	});

	const intrEmbed = new EmbedBuilder({
		title: 'Tem certeza de que vai limpar essa playlist?',
		description: `${playlist.playlist_name}`,
		fields: [
			{
				name: 'Total de músicas',
				value: `${playlist.playlist_tracks.length}`,
			},
		],
		color: 0x34eb8c,
	});

	const intrReply = await interaction.editReply({
		embeds: [intrEmbed],
		components: [
			new ActionRowBuilder<ButtonBuilder>({
				components: [trueButton, falseButton],
			}),
		],
	});

	const collector = intrReply.createMessageComponentCollector({
		componentType: ComponentType.Button,
	});

	collector.on(
		'collect',
		async (intr: {
			user: { id: string };
			customId: string;
			update: (arg0: {
				embeds: EmbedBuilder[] | never[];
				components: never[];
				content?: string;
			}) => never;
		}) => {
			if (intr.user.id != interaction.user.id) return;

			if (intr.customId === 'true') {
				playlist.playlist_tracks.splice(0, playlist.playlist_tracks.length);
				playlist.save();

				return intr.update({
					embeds: [],
					components: [],
					content: 'Playlist limpada!',
				});
			} else {
				return intr.update({ embeds: [], components: [], content: 'Okay!' });
			}
		}
	);
}
