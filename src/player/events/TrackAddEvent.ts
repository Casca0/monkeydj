import { GuildQueue, GuildQueueEvent, Track } from 'discord-player';
import { PlayerEventInterface } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';
import { EmbedBuilder } from 'discord.js';

export default class TrackAddEvent
implements PlayerEventInterface<typeof GuildQueueEvent.audioTrackAdd> {
	public name = GuildQueueEvent.audioTrackAdd;

	public async execute(
		queue: GuildQueue<PlayerMetadata>,
		track: Track<unknown>
	) {
		const trackEmbed = new EmbedBuilder({
			title: 'Musica adicionada à fila',
			description: `**[${track.title}](${track.url})** - ${track.author}`,
			thumbnail: {
				url: track.thumbnail,
			},
			color: 0x4feb34,
			footer: {
				text: `Pedido por ${track.requestedBy?.tag}`,
				iconURL: track.requestedBy?.displayAvatarURL(),
			},
		});

		queue.metadata.channel.send({ embeds: [trackEmbed] });
	}
}
