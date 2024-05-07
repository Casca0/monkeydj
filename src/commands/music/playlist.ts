import {
	type CommandData,
	type SlashCommandProps,
} from 'commandkit';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import { handlePlaylistCreate } from '#bot/utils/playlist/create';
import { handlePlaylistAdd } from '#bot/utils/playlist/add';
import { handlePlaylistRemove } from '#bot/utils/playlist/remove';
import { handlePlaylistPlay } from '#bot/utils/playlist/play';
import { handlePlaylistSee } from '#bot/utils/playlist/see';
import { handlePlaylistExtract } from '#bot/utils/playlist/extract';
import { handlePlaylistClear } from '#bot/utils/playlist/clear';
import { handlePlaylistDelete } from '#bot/utils/playlist/delete';

export const data: CommandData = {
	name: 'playlist',
	description: 'Comandos para a playlist.',
	type: ApplicationCommandType.ChatInput,
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
					name: 'sua_playlist',
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
					name: 'sua_playlist',
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
		{
			name: 'extrair',
			description: 'Extrai uma playlist para sua DM.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'playlist',
					description: 'A playlist para exportar.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
			],
		},
		{
			name: 'limpar',
			description: 'Limpa a playlist.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'sua_playlist',
					description: 'A playlist para limpar',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
			],
		},
		{
			name: 'excluir',
			description: 'Exclui a playlist.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'sua_playlist',
					description: 'A playlist para excluir',
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
	case 'extrair':
		return handlePlaylistExtract(props);
	case 'limpar':
		return handlePlaylistClear(props);
	case 'excluir':
		return handlePlaylistDelete(props);
	}
}
