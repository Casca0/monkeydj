import type { SlashCommandProps } from 'commandkit';

export default async function({ interaction }: SlashCommandProps) {
	const subcommand = interaction.options.getSubcommand(false) || '';

	if (!interaction.inCachedGuild()) return true;
	if (['criar', 'adicionar', 'remover', 'ver'].includes(subcommand)) {
		return false;
	}

	const selfChannel = interaction.guild.members.me?.voice.channel;
	const memberChannel = interaction.member.voice.channel;

	if (!selfChannel && !memberChannel) {
		await interaction.reply({ content: 'Entre num canal de voz primeiro.' });
		return true;
	}

	if (
		(selfChannel && !memberChannel) ||
    (selfChannel && memberChannel && selfChannel.id !== memberChannel.id)
	) {
		await interaction.reply({ content: `Entre no canal ${selfChannel.toString()} para usar este comando.` });
		return true;
	}
}
