import type { CommandData, SlashCommandProps } from 'commandkit';
import { useQueue } from 'discord-player';

export const data: CommandData = {
	name: 'embaralhar',
	description: 'Embaralha a fila atual de músicas.',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId);

	if (queue?.isEmpty()) {
		return interaction.editReply({ content: 'A fila está vázia.' });
	}

	queue?.tracks.shuffle();

	return interaction.editReply({ content: 'Fila embaralhada.' });
}
