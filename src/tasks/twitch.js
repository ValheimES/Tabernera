/* eslint max-depth: ["error", 6]*/
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

		const r = this.client.providers.default.db;

		const canal = guild.channels.get(guild.configs.channels.twitch);
		const usuarios = await r.table('streamers');

		if (usuarios.length === 0 || !canal) return false;

		let channels = '';

		for (let i = 0; i < usuarios.length; i++)
			channels += `,${usuarios[i].nombreCuentaTwitch}`;

		console.log(channels);
		url.search = new URLSearchParams([['channel', channels], ['stream_type', 'live'], ['game', 'Sea of Thieves'], ['client_id', 'radjtg8zklal4pt79x0xdxfucsk61z']]);
		const result = await fetch(url);
		const res = await result.json();

		for (let i = 0; i < res.streams.length; i++) {
			if (res.streams[i].game === 'Sea of Thieves') {
				const createdAt = await r.table('streams').get(res.streams[i]._id)('createdAt').default(-1);
				if (createdAt !== -1) {
					if (await r.table('streams').get(res.streams[i]._id)('createdAt') !== res.streams[i].created_at) {
						const tabla = await r.table('streamers');
						let imagen;
						for (let j = 0; j < tabla.length; j++) {
							if (tabla[i].nombreCuentaTwitch === res.streams[i].channel.display_name) {
								imagen = await guild.members.get(tabla[i].id);
								imagen = imagen.user.avatarURL();
							}
						}

						const embed = new MessageEmbed().setTitle(res.streams[i].channel.status)
							.setAuthor(res.streams[i].channel.display_name, imagen)
							.setThumbnail(res.streams[i].channel.logo)
							.setImage(res.streams[i].preview.large)
							.addField('Game:', res.streams[i].game, true)
							.addField('Viewers:', res.streams[i].viewers, true)
							.setColor(8478656);
						canal.send(embed);

						await r.table('streams').get(res.streams[i]._id).update({ id: res.streams[i]._id, createdAt: res.streams[i].created_at });
					}
				} else {
					const tabla = await r.table('streamers');
					let imagen;
					for (let j = 0; j < tabla.length; j++) {
						if (tabla[i].nombreCuentaTwitch === res.streams[i].channel.display_name) {
							imagen = await guild.members.get(tabla[i].id);
							imagen = imagen.user.avatarURL();
						}
					}

					const embed = new MessageEmbed().setTitle(res.streams[i].channel.status)
						.setAuthor(res.streams[i].channel.display_name, imagen)
						.setThumbnail(res.streams[i].channel.logo)
						.setImage(res.streams[i].preview.large)
						.addField('Juego:', res.streams[i].game, true)
						.addField('Seguidores:', res.streams[i].channel.followers, true)
						.setColor(8478656);
					canal.send(embed);
					await r.table('streams').insert({ id: res.streams[i]._id, createdAt: res.streams[i].created_at });
				}
			}
		}

		return true;
	}

};
