import type { CommandData, SlashCommandProps } from 'commandkit';
import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';

export const data: CommandData = {
	name: 'remover',
	description: 'Remova uma música da fila.',
	options: [
		{
			name: 'posição',
			description: 'Posição da música na fila.',
			required: true,
			type: ApplicationCommandOptionType.Integer,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	await interaction.deferReply();

	const queue = useQueue(interaction.guildId);
	const indexOption = interaction.options.getInteger('posição', true);

	if (queue?.isEmpty()) {
		return interaction.editReply({ content: 'A fila está vázia.' });
	}

	const trackIndex = indexOption - 1;
	const trackName = queue?.tracks.store[trackIndex].title;

	queue?.removeTrack(queue?.tracks.store[trackIndex]);

	return interaction.editReply({ content: `Música (**${trackName}**) removida da fila.` });
}
