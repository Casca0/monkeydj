import type { CommandData, SlashCommandProps } from 'commandkit';
import { useQueue } from 'discord-player';

export const data: CommandData = {
	name: 'skip',
	description: 'Pula para a próxima música.',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId!);

	if (!queue?.isPlaying()) {
		return interaction.editReply({ content: 'Nenhuma música está tocando!' });
	}

	queue.node.skip();

	return interaction.editReply({ content: 'Pulei para a próxima música!' });
}
