const { useMasterPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

const { buttonRow } = require('../utils/dashboardComponents');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.autocomplete(interaction);
			}
			catch (e) {
				console.error(e);
				return interaction.channel.send(`Ocorreu um erro\n${e}`);
			}
		}
		else if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			await interaction.deferReply();

			try {
				await command.execute(interaction);
			}
			catch (e) {
				console.error(e);
				return await interaction.followUp(`Ocorreu um erro\n${e}`);
			}
		}
		else if (interaction.isUserContextMenuCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			await interaction.deferReply();

			try {
				await command.execute(interaction);
			}
			catch (e) {
				console.error(e);
				return await interaction.followUp(`Ocorreu um erro\n${e}`);
			}
		}
		else if (interaction.isButton()) {
			const player = useMasterPlayer();
			const queue = player.nodes.get(interaction.guild.id);

			if (!queue.tracks) {
				const reply = await interaction.reply('Nenhuma música esta tocando!');
				setTimeout(() => {
					reply.delete();
				}, 3000);
				return;
			}

			if (interaction.customId == 'playpause') {
				queue.node.setPaused(!queue.node.isPaused());

				const reply = await interaction.reply(queue.node.isPaused() ? 'Música pausada!' : 'Música retomada!');

				setTimeout(() => {
					reply.delete();
				}, 3000);
			}
			else if (interaction.customId === 'stop') {
				const message = await queue.metadata.dashboard.messages.fetch();
				const embed = message.find(msg => msg.content === '').embeds[0];

				const musicEmbed = EmbedBuilder.from(embed);

				musicEmbed.setTitle('Nenhuma música está tocando');
				musicEmbed.setDescription(null);
				musicEmbed.setThumbnail(null);
				musicEmbed.setFields({
					name: '\u200b',
					value: '\u200b',
				});

				message.find(msg => msg.content === '').edit({
					embeds: [musicEmbed],
					components: [buttonRow],
				});

				queue.delete();

				const reply = await interaction.reply({ content: 'Player Parado!' });

				setTimeout(() => {
					reply.delete();
				}, 3000);
			}
			else if (interaction.customId === 'clear') {
				queue.clear();

				const message = await queue.metadata.dashboard.messages.fetch();
				const embed = message.find(msg => msg.content === '').embeds[0];

				const musicEmbed = EmbedBuilder.from(embed);

				musicEmbed.setFields({
					name: 'Próxima música',
					value: 'Não tem.',
				});

				message.find(msg => msg.content === '').edit({
					embeds: [musicEmbed],
					components: [buttonRow],
				});

				const reply = await interaction.reply({ content: 'Fila de músicas excluída!' });

				setTimeout(() => {
					reply.delete();
				}, 3000);
			}
			else if (interaction.customId === 'skip') {
				const currentTrack = queue.currentTrack;

				queue.node.skip();

				if (queue.tracks.data.length <= 0) {
					const message = await queue.metadata.dashboard.messages.fetch();
					const embed = message.find(msg => msg.content === '').embeds[0];

					const musicEmbed = EmbedBuilder.from(embed);

					musicEmbed.setTitle('Nenhuma música está tocando');
					musicEmbed.setDescription(null);
					musicEmbed.setThumbnail(null);
					musicEmbed.setFields({
						name: '\u200b',
						value: '\u200b',
					});

					message.find(msg => msg.content === '').edit({
						embeds: [musicEmbed],
						components: [buttonRow],
					});
				}

				const reply = await interaction.reply({ content: `Pulando a música atual (**${currentTrack}**)` });

				setTimeout(() => {
					reply.delete();
				}, 3000);
			}
			else if (interaction.customId === 'shuffle') {
				const message = await queue.metadata.dashboard.messages.fetch();
				const embed = message.find(msg => msg.content === '').embeds[0];

				const musicEmbed = EmbedBuilder.from(embed);

				queue.tracks.shuffle();

				musicEmbed.setFields({
					name: 'Próxima música',
					value: queue.tracks.data[0] ? `**[${queue.tracks.data[0].title}](${queue.tracks.data[0].url})** - ${queue.tracks.data[0].author}` : 'Não tem.',
				});

				message.find(msg => msg.content === '').edit({
					embeds: [musicEmbed],
					components: [buttonRow],
				});

				const reply = await interaction.reply({ content: 'Fila embaralhada!' });

				setTimeout(() => {
					reply.delete();
				}, 3000);
			}
		}
	},
};
