import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';

export async function handlePlaylistCreate({ interaction }: SlashCommandProps) {
	const playlistName = interaction.options.getString('nome', true);

	await playlistModel.create({
		playlist_name: playlistName,
		user_id: interaction.user.id,
	});

	return interaction.reply('Playlist criada!');
}
