import { GuildQueue, GuildQueueEvent } from 'discord-player';
import { PlayerEventInterface } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';

// prettier-ignore
export default class DebugEvent
implements PlayerEventInterface<typeof GuildQueueEvent.debug>
{
	public name = GuildQueueEvent.debug;

	public async execute(queue: GuildQueue<PlayerMetadata>, message: string) {
		console.log(`Player debug event: ${message}`);
	}
}
