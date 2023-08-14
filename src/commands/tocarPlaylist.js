const { SlashCommandBuilder } = require('discord.js');
const { Track, useMainPlayer } = require('discord-player/dist');

const { playlistModel } = require('../models/playlistModel.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tocarplaylist')
		.setDescription('Toque alguma playlist.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Selecione o user para pegar uma playlist.')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('playlist')
				.setDescription('A playlist para tocar.')
				.setRequired(true)
				.setAutocomplete(true),
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
		await interaction.deferReply();

		const playlistName = interaction.options.getString('playlist');

		if (!interaction.member.voice.channelId) {
			return interaction.reply({ content: 'Entre num canal de voz primeiro.' });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return interaction.reply({ content: 'Não estamos no mesmo canal de voz.' });
		}

		const playlist = await playlistModel.findOne({ playlist_name: playlistName });

		if (!playlist) return interaction.reply('Você não tem uma playlist com esse nome.');

		const player = useMainPlayer();

		let queue = player.nodes.get(interaction.guild.id);

		if (!queue) {
			const findDashboard = await interaction.guild.channels.cache.find(c => c.name == 'monkeydj-dashboard');

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
					dashboard: findDashboard,
					channel: interaction.channel,
				},
			});
		}

		const tracks = playlist.playlist_tracks.map(music => new Track(player, music));

		queue.addTrack(tracks);
		queue.tracks.shuffle();

		if (!queue.connection) await queue.connect(interaction.member.voice.channel);

		if (!queue.node.isPlaying()) await queue.node.play();

		return interaction.followUp('Playlist carregada!');

	},
};
