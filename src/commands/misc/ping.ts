import type { CommandData, SlashCommandProps, CommandOptions } from 'commandkit';

export const data: CommandData = {
	name: 'ping',
	description: 'Pong!',
};

export function run({ interaction, client }: SlashCommandProps) {
	interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
}

export const options: CommandOptions = {
	guildOnly: true,
	userPermissions: ['Administrator', 'AddReactions'],
	deleted: false,
};
