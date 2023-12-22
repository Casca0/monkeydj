import {
	type CommandData,
	type SlashCommandProps,
	CommandType,
} from 'commandkit';
import { ApplicationCommandOptionType } from 'discord.js';
import { handlePlaylistCreate } from '#bot/utils/playlist/create';
import { handlePlaylistAdd } from '#bot/utils/playlist/add';
import { handlePlaylistRemove } from '#bot/utils/playlist/remove';
import { handlePlaylistPlay } from '#bot/utils/playlist/play';
import { handlePlaylistSee } from '#bot/utils/playlist/see';

export const data: CommandData = {
	name: 'playlist',
	description: 'Comandos para a playlist.',
	type: CommandType.ChatInput,
	options: [
		{
			name: 'criar',
			description: 'Crie uma nova playlist.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'nome',
					description: 'O nome da nova playlist.',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: 'adicionar',
			description: 'Adicione músicas em uma playlist sua.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'playlist',
					description: 'O nome da playlist.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
				{
					name: 'query',
					description: 'A música ou playlist para adicionar.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
			],
		},
		{
			name: 'remover',
			description: 'Remove uma música de uma playlist sua.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'playlist',
					description: 'Nome da playlist',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
				{
					name: 'musica',
					description: 'Indíce da música.',
					type: ApplicationCommandOptionType.Integer,
					required: true,
				},
			],
		},
		{
			name: 'play',
			description: 'Bota uma playlist na fila atual de músicas.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'playlist',
					description: 'A playlist para adicionar na fila.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
				{
					name: 'embaralhar',
					description: 'Embaralhar a fila de músicas?',
					type: ApplicationCommandOptionType.Boolean,
				},
			],
		},
		{
			name: 'ver',
			description: 'Veja a playlist de algum membro do servidor.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'membro',
					description: 'O membro da playlist.',
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: 'playlists',
					description: 'As playlists do membro.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
			],
		},
	],
};

export async function run(props: SlashCommandProps) {
	const { interaction } = props;

	if (!interaction.inCachedGuild()) return;

	const subcommand = interaction.options.getSubcommand(true);

	switch (subcommand) {
	case 'criar':
		return handlePlaylistCreate(props);
	case 'adicionar':
		return handlePlaylistAdd(props);
	case 'remover':
		return handlePlaylistRemove(props);
	case 'play':
		return handlePlaylistPlay(props);
	case 'ver':
		return handlePlaylistSee(props);
	}
}
