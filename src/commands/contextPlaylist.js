const { ContextMenuCommandBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');

const PocketBase = require('pocketbase/cjs');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Ver playlist')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const pb = new PocketBase('https://monkeydj.pockethost.io');
		const user = interaction.targetUser;

		let getTracks;

		if (!user) {
			getTracks = await pb.collection('serverplaylist').getFullList();
		}
		else {
			getTracks = await pb.collection('serverplaylist').getFullList({
				filter: `user_id=${user.id}`,
			});
		}

		if (getTracks.length === 0) {
			return interaction.followUp('Não há músicas na playlist desse user!');
		}

		try {
			const tracks = getTracks.map(record => record.track);

			const backButton = new ButtonBuilder({
				style: ButtonStyle.Secondary,
				label: 'Voltar',
				emoji: '⬅️',
				customId: 'back',
			});

			const forwardButton = new ButtonBuilder({
				style: ButtonStyle.Secondary,
				label: 'Seguir',
				emoji: '➡️',
				customId: 'forward',
			});

			const generatePlaylistEmbed = async start => {
				const currentPage = tracks.slice(start, start + 5);

				return new EmbedBuilder({
					title: `Playlist do ${user ? user.username : 'servidor'}`,
					thumbnail: {
						url: user ? user.avatarURL({ dynamic: true }) : interaction.guild.iconURL({ dynamic: true }),
					},
					description: `**Total : ${tracks.length}**`,
					fields:
					await Promise.all(
						currentPage.map(async (track, index) => ({
							name: '\u200B',
							value: `**${index + start + 1} - [${track.title}](${track.url}) - ${track.author}**`,
						})),
					),
					color: 0xa834eb,
				});
			};

			const canFitInOnePage = tracks.length <= 5;

			const interactionReply = await interaction.followUp({
				embeds: [await generatePlaylistEmbed(0)],
				components: canFitInOnePage ? [] : [new ActionRowBuilder({
					components: [forwardButton],
				})],
			});

			if (canFitInOnePage) return;

			const buttonCollector = interactionReply.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			let currentIndex = 0;

			buttonCollector.on('collect', async intr => {
				if (intr.user.id != interaction.user.id) return;

				intr.customId === 'back' ? (currentIndex -= 5) : (currentIndex += 5);

				return intr.update({
					embeds: [await generatePlaylistEmbed(currentIndex)],
					components: [
						new ActionRowBuilder({
							components: [
								...(currentIndex ? [backButton] : []),
								...(currentIndex + 5 < tracks.length ? [forwardButton] : []),
							],
						}),
					],
				});
			});
		}
		catch (err) {
			console.log(err);
			return interaction.followUp({ content: 'Ocorreu um erro ao tentar exibir a playlist.', ephemeral: true });
		}
	},
};
