import { GuildQueue, GuildQueueEvent } from 'discord-player';
import { PlayerEvent } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';

// prettier-ignore
export default class ErrorEvent
implements PlayerEvent<typeof GuildQueueEvent.error>
{
	public name = GuildQueueEvent.error;

	public async execute(queue: GuildQueue<PlayerMetadata>, error: Error) {
		console.log(`General player error event: ${error.message}`);
	}
}
