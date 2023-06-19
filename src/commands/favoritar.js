const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { useQueue } = require('discord-player/dist');

const { playlistModel } = require('../models/playlistModel.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('favoritar')
		.setDescription('Favorite a música atual do player.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		const track = queue.currentTrack;

		if (!queue || !track) {
			return interaction.reply('Nenhuma música esta tocando!');
		}

		const musicEmbed = new EmbedBuilder({
			title: 'Música favoritada',
			description: `**[${track.title}](${track.url})** - ${track.author}`,
			thumbnail: {
				url: track.thumbnail,
			},
			color: 0x053685,
		});

		const acceptButton = new ButtonBuilder({
			customId: 'accept',
			label: 'Sim',
			style: ButtonStyle.Success,
		});

		const rejectButton = new ButtonBuilder({
			customId: 'reject',
			label: 'Não',
			style: ButtonStyle.Danger,
		});

		const buttonRow = new ActionRowBuilder({
			components: [acceptButton, rejectButton],
		});

		interaction.user.send({ embeds: [musicEmbed] });

		const reply = await interaction.user.send({ content: 'Quer adicionar a música à uma playlist sua?', components: [buttonRow] });

		const buttonCollector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
		});

		buttonCollector.on('collect', async intr => {
			if (intr.customId === 'accept') {
				const playlists = await playlistModel.find({ user_id: interaction.user.id });

				const options = playlists.slice(0, playlists.length).map((p) => ({
					label: p.playlist_name,
					value: p.playlist_name,
				}));

				const selectMenu = new StringSelectMenuBuilder({
					customId: 'playlists',
					placeholder: 'Suas playlists',
					options: options,
				});

				const menuReply = await intr.update({ content: 'Selecione a playlist para adicionar a música.', components: [
					new ActionRowBuilder().addComponents(selectMenu),
				] });

				const menuCollector = menuReply.createMessageComponentCollector({
					componentType: ComponentType.StringSelect,
				});

				menuCollector.on('collect', async menu => {
					const playlist = playlists.find(p => p.playlist_name == menu.values[0]);

					playlist.playlist_tracks.push(track.toJSON());
					playlist.save();

					return intr.editReply({ content: `Música adicionada à playlist **${playlist.playlist_name}**.`, components: [] });
				});
			}
			if (intr.customId === 'reject') {
				return intr.update({ content: 'Okay!', components: [] });
			}
		});

		return interaction.reply('Musica favoritada!');
	},
};
