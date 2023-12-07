import type { CommandData, SlashCommandProps } from 'commandkit';
import { useTimeline } from 'discord-player';

export const data: CommandData = {
	name: 'pause',
	description: 'Pausa a música atual',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const timeline = useTimeline(interaction.guildId);

	if (!timeline?.track) {
		return interaction.editReply({ content: 'Nenhuma música está tocando!' });
	}

	if (timeline.paused) {
		return interaction.editReply({ content: 'A música já está pausada!' });
	}

	timeline.pause();

	return interaction.editReply({ content: 'Música pausada.' });
}
