const { Schema, model } = require('mongoose');

const UserPlaylist = new Schema({
	playlist_name: {
		type: String,
	},
	user_id: {
		type: String,
	},
	playlist_tracks: {
		type: [Object],
	},
});

const playlistModel = model('Playlists', UserPlaylist);

module.exports = { playlistModel };
