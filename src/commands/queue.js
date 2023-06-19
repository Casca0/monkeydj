const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ComponentType, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { useQueue } = require('discord-player/dist');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Mostra a fila de música atual.'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			return interaction.reply({ content: 'Nenhuma música na fila!', ephemeral: true });
		}

		const currentTrack = queue.currentTrack;

		const tracks = queue.tracks.store;

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
			const currentPage = tracks.slice(start, start + 10);

			return new EmbedBuilder({
				title: 'Fila do Servidor',
				description: `🎶 | Tocando agora\n**[${currentTrack.title}](${currentTrack.url}) - ${currentTrack.author}**`,
				fields:
					await Promise.all(
						currentPage.map(async (track, index) => ({
							name: '\u200B',
							value: `**${index + start + 1} - [${track.title}](${track.url}) - ${track.author}**`,
						})),
					),
				color: 0xff0000,
			});
		};

		const totalItensInPage = 10;

		const canFitInOnePage = tracks.length <= totalItensInPage;

		const interactionReply = await interaction.reply({
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

			intr.customId === 'back' ? (currentIndex -= totalItensInPage) : (currentIndex += totalItensInPage);

			return intr.update({
				embeds: [await generatePlaylistEmbed(currentIndex)],
				components: [
					new ActionRowBuilder({
						components: [
							...(currentIndex ? [backButton] : []),
							...(currentIndex + totalItensInPage < tracks.length ? [forwardButton] : []),
						],
					}),
				],
			});
		});
	},
};
