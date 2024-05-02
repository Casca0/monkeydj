import { GuildQueue, GuildQueueEvent } from 'discord-player';
import { PlayerEvent } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';

// prettier-ignore
export default class PlayerError
implements PlayerEvent<typeof GuildQueueEvent.playerError>
{
	public name = GuildQueueEvent.playerError;

	public async execute(queue: GuildQueue<PlayerMetadata>, error: Error) {
		console.log(`Player error event: ${error.message}`);
	}
}
