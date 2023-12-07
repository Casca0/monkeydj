import type { ValidationFunctionProps } from 'commandkit';

export default async function({
	interaction,
}: ValidationFunctionProps) {
	if (!interaction.inCachedGuild()) return true;

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
