import { type GuildQueueEvents, useMainPlayer } from 'discord-player';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { PlayerEventsPath } from '#bot/utils/constants';
import type { Constructable, PlayerEventInterface } from './common/types.js';

export async function registerPlayerEvents() {
	const files = await readdir(PlayerEventsPath);
	const player = useMainPlayer();

	const loader = files.map(async (file) => {
		const { default: Event } = (await import(
			`file://${join(PlayerEventsPath, file)}`
		)) as {
			default: Constructable<PlayerEventInterface<keyof GuildQueueEvents>>;
		};

		const event = new Event();

		player.events.on(event.name, event.execute.bind(event));
		player.on('debug', async (message: string) =>
			console.log(`General player debug event ${message}`)
		);
	});

	await Promise.all(loader);
}
