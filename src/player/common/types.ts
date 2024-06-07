import { GuildQueueEvents } from 'discord-player';
import { PlayerMetadata } from '../PlayerMetadata.js';

export interface PlayerEventInterface<
	K extends keyof GuildQueueEvents,
	M = PlayerMetadata
> {
	name: K;
	execute: GuildQueueEvents<M>[K];
}

export type Constructable<T> = new (...args: unknown[]) => T;
