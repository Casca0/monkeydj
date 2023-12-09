import { Schema, model, SchemaTypes } from 'mongoose';
import { SerializedTrack } from 'discord-player';

export interface IPlaylistSchema {
	playlist_name: string,
	user_id: string,
	playlist_tracks: SerializedTrack[],
}

const UserPlaylist = new Schema<IPlaylistSchema>({
	playlist_name: {
		type: SchemaTypes.String,
		required: true,
	},
	user_id: {
		type: SchemaTypes.String,
		required: true,
	},
	playlist_tracks: {
		type: [SchemaTypes.Mixed as never],
		default: [],
	},
});

export const playlistModel = model<IPlaylistSchema>('Playlists', UserPlaylist);
