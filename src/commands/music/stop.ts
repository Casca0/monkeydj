import type { CommandData, SlashCommandProps } from 'commandkit';
import { useQueue } from 'discord-player';

export const data: CommandData = {
	name: 'stop',
	description: 'Interrompe o player.',
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId!);

	if (queue) {
		queue.node.stop();
		queue.delete();
		return interaction.editReply({ content: 'Player parado!' });
	}

	return interaction.editReply({ content: 'Nenhuma música está tocando!' });
}
