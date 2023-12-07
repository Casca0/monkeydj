import { GuildQueue, GuildQueueEvent, Track } from 'discord-player';
import { PlayerEvent } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';
import { EmbedBuilder } from 'discord.js';

export default class PlaylistAddEvent
implements PlayerEvent<typeof GuildQueueEvent.audioTracksAdd> {
	public name = GuildQueueEvent.audioTracksAdd;

	public async execute(
		queue: GuildQueue<PlayerMetadata>,
		track: Track<unknown>[]
	) {
		const page = 1;
		const pageStart = 10 * (page - 1);
		const pageEnd = pageStart + 10;

		const tracks = track.slice(pageStart, pageEnd).map((m, i) => {
			return `${i + pageStart + 1}. **[${m.title}](${m.url}) - ${m.author}**`;
		});

		const trackEmbed = new EmbedBuilder({
			title: 'Músicas adicionadas a fila!',
			description: `${tracks.join('\n')}${
				queue.tracks.size > pageEnd ?
					`\n...${queue.tracks.size - pageEnd} mais música(s)` :
					''
			}`,
			color: 0x4feb34,
		});
		queue.metadata.channel.send({ embeds: [trackEmbed] });
	}
}
