import type { CommandData, SlashCommandProps } from 'commandkit';
import { usePlayer, useTimeline } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export const data: CommandData = {
	name: 'tocandoagora',
	description: 'A música que está tocando no momento.',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const node = usePlayer(interaction.guildId)!;
	const timeline = useTimeline(interaction.guildId);

	if (!timeline?.track) {
		return interaction.editReply({ content: 'Nenhuma música está tocando!' });
	}

	const { track, timestamp } = timeline;

	const embed = new EmbedBuilder({
		title: 'Tocando agora',
		description: `**[${track.title}](${track.url})** - ${track.author}`,
		fields: [
			{
				name: 'Progresso',
				value: node.createProgressBar()!,
			},
		],
		thumbnail: {
			url: track.thumbnail,
		},
		color: 0x4D3A81,
		footer: {
			text: `Pedido por ${track.requestedBy?.tag} • ${timestamp.progress}%`,
			iconURL: track.requestedBy?.displayAvatarURL(),
		},
	},);

	return interaction.editReply({ embeds: [embed] });
}
