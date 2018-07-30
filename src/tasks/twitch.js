const { Task } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const url = new URL('https://api.twitch.tv/kraken/streams/');
const debug = true;

module.exports = class extends Task {

	constructor(...args) {
		super(...args, { name: 'twitch', enabled: true });
	}

	async run() {
		const guild = this.client.guilds.get(debug ? '420911335187152909' : '375828283184513033');
		if (!guild) return false;

		const canal = guild.channels.get(guild.configs.channels.twitch);
		const usuarios = guild.configs.streamers;

		if (usuarios.length === 0 || !canal) return false;

		const channels = `,${usuarios.join(',')}`;
		url.search = new URLSearchParams([['channel', channels], ['stream_type', 'live'], ['game', 'Sea of Thieves'], ['client_id', 'radjtg8zklal4pt79x0xdxfucsk61z']]);
		const result = await fetch(url);
		const res = await result.json();

		const r = this.client.providers.default.db;

		for (let i = 0; i < res.streams.length; i++) {
			if (res.streams[i].game === 'Sea of Thieves') {
				const createdAt = await r.table('streamers').get(res.streams[i]._id)('createdAt').default(-1);
				if (createdAt !== -1) {
					if (await r.table('streamers').get(res.streams[i]._id)('createdAt') !== res.streams[i].created_at) {
						const embed = new MessageEmbed().setTitle(res.streams[i].channel.status)
							.setAuthor(res.streams[i].channel.display_name, res.streams[i].channel.logo)
							.setThumbnail(res.streams[i].channel.logo)
							.setImage(res.streams[i].preview.large)
							.addField('Game:', res.streams[i].game, true)
							.addField('Viewers:', res.streams[i].viewers, true)
							.setColor(7358401);
						canal.send(embed);

						await r.table('streamers').get(res.streams[i]._id).update({ id: res.streams[i]._id, createdAt: res.streams[i].created_at });
					}
				} else {
					const embed = new MessageEmbed().setTitle(res.streams[i].channel.status)
						.setAuthor(res.streams[i].channel.display_name, res.streams[i].channel.logo)
						.setThumbnail(res.streams[i].channel.logo)
						.setImage(res.streams[i].preview.large)
						.addField('Game:', res.streams[i].game, true)
						.addField('Viewers:', res.streams[i].viewers, true)
						.setColor(7358401);
					canal.send(embed);
					await r.table('streamers').insert({ id: res.streams[i]._id, createdAt: res.streams[i].created_at });
				}
			}
		}

		return true;
	}

};
