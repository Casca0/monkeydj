// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, CommandInteraction, Client } = require('discord.js');
const { SearchResultType } = require('distube');

// const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Envie uma URL para tocar música.')
		.addStringOption(option =>
			option.setName('tipo')
				.setDescription('O tipo da query.')
				.setRequired(true)
				.addChoices(
					{ name: 'Video', value: 'video' },
					{ name: 'Playlist', value: 'playlist' },
				),
		)
		.addStringOption(option =>
			option.setName('query')
				.setDescription('URL ou nome da música.')
				.setAutocomplete(true)
				.setRequired(true),
		),
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
	async autocomplete(interaction, client) {
		const query = interaction.options.getString('query');

		const results = await client.player.search(query);

		const tracks = results.slice(0, 10).map((t) => {
			let title = t.name;

			if (title.length >= 100) {
				title = title.substring(0, 96).trimEnd() + '...';
			}

			const obj = {
				name: title,
				value: t.url,
			};

			return obj;
		});

		await interaction.respond(
			tracks,
		);
	},
	/**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
	async execute(interaction, client) {
		const channel = interaction.member.voice.channel;

		if (!interaction.member.voice.channelId) {
			return interaction.followUp({ content: 'Entre num canal de voz primeiro.' });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return interaction.followUp({ content: 'Não estamos no mesmo canal de voz.' });
		}

		const query = interaction.options.getString('query');
		const queryType = interaction.options.getString('tipo');

		let searchResult;

		if (queryType === 'video') {
			searchResult = await client.player.search(query, {
				type: SearchResultType.VIDEO,
			}).catch((err) => {
				console.log(err);
			});
		}
		else if (queryType === 'playlist') {
			searchResult = await client.player.search(query, {
				type: SearchResultType.PLAYLIST,
			}).catch((err) => {
				console.log(err);
			});
		}

		if (searchResult == null) return interaction.followUp('Não encontrei a música.');

		// return interaction.followUp(`Encontrei ${searchResult[0].name}`);

		// const findDashboard = await interaction.guild.channels.cache.find(c => c.name == 'monkeydj-dashboard');

		// const queue = player.nodes.create(interaction.guild, {
		// 	volume: false,
		// 	disableHistory: true,
		// 	leaveOnEmpty: true,
		// 	leaveOnEmptyCooldown: 30000,
		// 	leaveOnEnd: true,
		// 	leaveOnEndCooldown: 30000,
		// 	selfDeaf: true,
		// 	skipOnNoStream: true,

		// 	metadata: {
		// 		dashboard: findDashboard,
		// 		channel: interaction.channel,
		// 	},
		// });

		// interaction.followUp({ content: `Carregando a ${searchResult.playlist ? `playlist **${searchResult.playlist.title}**` : `música **${searchResult.tracks[0].title}**`}` });

		if (queryType === 'playlist') {
			client.player.play(channel, searchResult, {
				member: interaction.member,
				textChannel: interaction.channel,
				interaction,
			});
		}
		else {
			client.player.play(channel, searchResult[0], {
				member: interaction.member,
				textChannel: interaction.channel,
				interaction,
			});
		}

		return interaction.followUp('DEU BÃO');

		// try {
		// 	if (!queue.connection) await queue.connect(channel);
		// 	if (!queue.node.isPlaying()) {
		// 		await queue.node.play();
		// 		return interaction.editReply('Player iniciado.');
		// 	}
		// 	else {
		// 		if (queue.metadata.dashboard) {
		// 			if (queue.tracks.data.length === 1) {
		// 				const message = await queue.metadata.dashboard.messages.fetch();
		// 				const embed = message.find(msg => msg.content === '').embeds[0];

		// 				const musicEmbed = EmbedBuilder.from(embed);

		// 				musicEmbed.setFields({
		// 					name: 'Próxima música',
		// 					value: queue.tracks.data[0] ? `**[${queue.tracks.data[0].title}](${queue.tracks.data[0].url})** - ${queue.tracks.data[0].author}` : 'Não tem.',
		// 				});

		// 				message.find(msg => msg.content === '').edit({
		// 					embeds: [musicEmbed],
		// 					components: [buttonRow],
		// 				});
		// 			}
		// 		}
		// 		return;
		// 	}
		// }
		// catch (e) {
		// 	console.error(e);
		// 	queue.delete();
		// 	return interaction.followUp(`Ocorreu o seguinte erro : ${e}`);
		// }

	},
};
