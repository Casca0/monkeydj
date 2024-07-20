import { GuildQueue, GuildQueueEvent, Track } from 'discord-player';
import { PlayerEventInterface } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';
import { EmbedBuilder } from 'discord.js';

export default class TrackStartEvent
implements PlayerEventInterface<typeof GuildQueueEvent.playerStart> {
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

		queue.metadata.channel.send({
			embeds: [trackEmbed],
			flags: ['SuppressNotifications'],
		});
	}
}
