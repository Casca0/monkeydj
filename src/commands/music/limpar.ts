import type { CommandData, SlashCommandProps } from 'commandkit';
import { useQueue } from 'discord-player';

export const data: CommandData = {
	name: 'limpar',
	description: 'Limpa a fila atual de músicas.',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId!);

	if (!queue?.tracks) {
		return interaction.editReply({ content: 'Nenhuma música está tocando!' });
	}

	queue.tracks.clear();

	return interaction.editReply({ content: 'Limpei a fila de músicas.' });
}
