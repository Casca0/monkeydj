import { GuildQueue, GuildQueueEvent, Track } from 'discord-player';
import { PlayerEvent } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';
import { EmbedBuilder } from 'discord.js';

export default class TrackStartEvent
implements PlayerEvent<typeof GuildQueueEvent.playerStart> {
	public name = GuildQueueEvent.playerStart;

	public async execute(
		queue: GuildQueue<PlayerMetadata>,
		track: Track<unknown>
	) {
		const trackEmbed = new EmbedBuilder({
			title: 'Tocando agora',
			description: `**[${track.title}](${track.url})** - ${track.author}`,
			thumbnail: {
				url: track.thumbnail,
			},
			footer: {
				text: `${track.requestedBy ? `Pedido por ${track.requestedBy.tag}` : ''}`,
				iconURL: track.requestedBy?.displayAvatarURL(),
			},
		});

		queue.metadata.channel.send({ embeds: [trackEmbed] });
	}
}
