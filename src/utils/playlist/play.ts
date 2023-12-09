import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import { Track, deserialize, useMainPlayer, useQueue } from 'discord-player';

export async function handlePlaylistPlay({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const playlistName = interaction.options.getString('playlist', true);
	const channel = interaction.member!.voice.channel!;
	const player = useMainPlayer();
	let queue = useQueue(interaction.guildId);

	const playlist = await playlistModel.findOne({ playlist_name: playlistName });

	if (!playlist) return interaction.reply('Não existe uma playlist com este nome.');

	await interaction.deferReply();

	const playlistTracks = playlist.playlist_tracks.map((track) => deserialize(player, track)) as Track[];

	if (!queue) {
		queue = player.nodes.create(interaction.guild, {
			disableHistory: true,
			leaveOnEmpty: true,
			leaveOnEmptyCooldown: 60000,
			leaveOnEnd: true,
			leaveOnEndCooldown: 60000,
			selfDeaf: true,
			noEmitInsert: true,
			leaveOnStop: false,
			pauseOnEmpty: true,
			preferBridgedMetadata: true,
			disableBiquad: true,
			metadata: {
				channel: interaction.channel,
			},
		});
	}

	queue.addTrack(playlistTracks);

	if (!queue.node.isPlaying()) {
		await queue.connect(channel);
		await queue.node.play();
		return interaction.editReply('Player iniciado.');
	}

	return interaction.editReply('Playlist carregada.');
}
