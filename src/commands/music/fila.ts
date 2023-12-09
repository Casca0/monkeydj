import type { CommandData, SlashCommandProps } from 'commandkit';
import { useQueue, useTimeline } from 'discord-player';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ComponentType, AnyComponentBuilder } from 'discord.js';

export const data: CommandData = {
	name: 'fila',
	description: 'Mostra a fila atual de músicas.',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId);
	const timeline = useTimeline(interaction.guildId);

	if (!queue) return interaction.editReply({ content: 'A fila está vazia.' });

	const currentTrack = timeline?.track;
	const tracks = queue?.tracks.store;

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

	const generatePlaylistEmbed = async (start: number) => {
		const currentPage = tracks!.slice(start, start + 10);

		return new EmbedBuilder({
			title: 'Fila do Servidor',
			description: `🎶 | Tocando agora\n**[${currentTrack?.title}](${currentTrack?.url}) - ${currentTrack?.author}**`,
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

	const canFitInOnePage = tracks!.length <= totalItensInPage;

	const actionRow = new ActionRowBuilder<ButtonBuilder>();

	const interactionReply = await interaction.editReply({
		embeds: [await generatePlaylistEmbed(0)],
		components: canFitInOnePage ? [] : [actionRow.setComponents([forwardButton])],
	});

	if (canFitInOnePage) return;

	const buttonCollector = interactionReply.createMessageComponentCollector({
		componentType: ComponentType.Button,
	});

	let currentIndex = 0;


	buttonCollector.on('collect', async (intr: { user: { id: string; }; customId: string; update: (arg0: { embeds: EmbedBuilder[]; components: ActionRowBuilder<AnyComponentBuilder>[]; }) => never; }) => {
		if (intr.user.id != interaction.user.id) return;

		intr.customId === 'back' ? (currentIndex -= totalItensInPage) : (currentIndex += totalItensInPage);

		return intr.update({
			embeds: [await generatePlaylistEmbed(currentIndex)],
			components: [
				new ActionRowBuilder({
					components: [
						...(currentIndex ? [backButton] : []),
						...(currentIndex + totalItensInPage < tracks!.length ? [forwardButton] : []),
					],
				}),
			],
		});
	});
}
