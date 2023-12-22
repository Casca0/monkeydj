import type { CommandData, SlashCommandProps } from 'commandkit';
import { useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';

export const data: CommandData = {
	name: 'play',
	description: 'Envie uma URL para tocar uma música.',
	options: [
		{
			name: 'query',
			description: 'A query da música',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		},
		{
			name: 'embaralhar',
			description: 'Devo embaralhar a fila de músicas?',
			type: ApplicationCommandOptionType.Boolean,
		},
	],
};

export async function run({ interaction }: SlashCommandProps) {
	const player = useMainPlayer();
	// @ts-expect-error: Member never is null;
	const channel = interaction.member!.voice.channel!;
	const query = interaction.options.getString('query');

	await interaction.deferReply();

	const result = await player.search(query!, {
		requestedBy: interaction.user,
	});

	if (!result.hasTracks()) {
		return interaction.editReply({ content: 'Não encontrei essa música!' });
	}

	const queue = player.nodes.create(interaction.guild!, {
		disableHistory: true,
		leaveOnEmpty: true,
		leaveOnEmptyCooldown: 60000,
		leaveOnEnd: true,
		leaveOnEndCooldown: 60000,
		selfDeaf: true,
		noEmitInsert: true,
		leaveOnStop: false,
		pauseOnEmpty: true,
		preferBridgedMetadata: true,
		disableBiquad: true,
		metadata: {
			channel: interaction.channel,
		},
	});

	try {
		await player.play(channel, result, {
			requestedBy: interaction.user,
		});

		if (interaction.options.getBoolean('embaralhar')) {
			queue.tracks.shuffle();
		}

		if (!queue.node.isPlaying()) {
			return interaction.editReply('Player iniciado!');
		}

		return interaction.editReply({ content: `Carregando a ${result.playlist ? `playlist **${result.playlist.title}**` : `música **${result.tracks[0].title}**`}` });
	}
	catch (error) {
		console.error(error);

		return interaction.editReply('Ocorreu um erro!');
	}
}
