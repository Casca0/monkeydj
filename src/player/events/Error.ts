import { GuildQueue, GuildQueueEvent } from 'discord-player';
import { PlayerEventInterface } from '../common/types.js';
import { PlayerMetadata } from '../PlayerMetadata.js';

// prettier-ignore
export default class ErrorEvent implements PlayerEventInterface<typeof GuildQueueEvent.error> {
	public name = GuildQueueEvent.error;

	public async execute(queue: GuildQueue<PlayerMetadata>, error: Error) {
		console.log(`General player error event: ${error.message}`);
	}
}
