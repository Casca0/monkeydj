const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const dashboardEmbed = new EmbedBuilder({
	title: 'Nenhuma música está tocando',
	color: 0x42f5a7,
	fields: [
		{
			name: '\u200b',
			value: '\u200b',
		},
	],
});

const playPauseButton = new ButtonBuilder({
	customId: 'playpause',
	label: 'Play/Pause',
	emoji: '⏯',
	style: ButtonStyle.Primary,
});

const stopButton = new ButtonBuilder({
	customId: 'stop',
	label: 'Stop',
	emoji: '⏹',
	style: ButtonStyle.Secondary,
});

const clearQueueButton = new ButtonBuilder({
	customId: 'clear',
	label: 'Limpar fila',
	emoji: '🗑',
	style: ButtonStyle.Danger,
});

const skipButton = new ButtonBuilder({
	customId: 'skip',
	label: 'Pular',
	emoji: '⏭',
	style: ButtonStyle.Secondary,
});

const shuffleButton = new ButtonBuilder({
	customId: 'shuffle',
	label: 'Embaralhar',
	emoji: '🔀',
	style: ButtonStyle.Secondary,
});

const buttonRow = new ActionRowBuilder({
	components: [playPauseButton, stopButton, clearQueueButton, skipButton, shuffleButton],
});

module.exports = { dashboardEmbed, buttonRow };
