const { Task } = require('klasa');
const config = require('../../config.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const url = new URL('https://api.twitch.tv/kraken/streams/');

//api.clientID = "radjtg8zklal4pt79x0xdxfucsk61z";

module.exports = class extends Task {

	constructor(...args) {
        super(...args, { name: 'twitch', enabled: true });
    }

	async run({ guildID }) {
		const guild = this.client.guilds.get('420911335187152909');
		if (!guild) return false;

		const canal = guild.channels.get(guild.configs.channels.twitch);
		const usuarios = guild.configs.streamers;

		console.log(canal);
		console.log(usuarios);

		if (usuarios.length === 0 || !canal) return false;

		let channels = `,${usuarios.join(',')}`;
		console.log(channels);
		url.search = new URLSearchParams([['channel', channels], ['stream_type', 'live'], ['game', 'Sea of Thieves'], ['client_id', 'radjtg8zklal4pt79x0xdxfucsk61z']]);
		const result = await fetch(url);
		const res = await result.json();

		const r = this.client.providers.default.db;

		for(let i = 0; i < res.streams.length; i++) {
			let createdAt = await r.table('streamers').get(res.streams[i]._id)('created_at').default(-1);
			if(createdAt !== -1) {
				if (await r.table('streamers').get(res.streams[i]._id)('created_at') !== res.streams[i].created_at) {
					let embed = new MessageEmbed().setTitle(res.streams[i].channel.status)
					.setAuthor(res.streams[i].channel.display_name, res.streams[i].channel.logo)
					.setThumbnail(res.streams[i].channel.logo)
					.setImage(res.streams[i].preview.large)
					.addField('Game:', res.streams[i].game, true)
					.addField('Viewers:', res.streams[i].viewers, true)
					.setColor(7358401);
					canal.send(embed);
					
					await r.table('streamers').get(res.streams[i]._id).update({id: res.streams[i]._id, created_at: res.streams[i].created_at});
				}
			} else {
				let embed = new MessageEmbed().setTitle(res.streams[i].channel.status)
				.setAuthor(res.streams[i].channel.display_name, res.streams[i].channel.logo)
				.setThumbnail(res.streams[i].channel.logo)
				.setImage(res.streams[i].preview.large)
				.addField('Game:', res.streams[i].game, true)
				.addField('Viewers:', res.streams[i].viewers, true)
				.setColor(7358401);
				canal.send(embed);
				await r.table('streamers').insert({id: res.streams[i]._id, created_at: res.streams[i].created_at});
			}
		}

		//return res.json();

		return true;
	}

	 async init() {
	 	//const { tasks } = this.client.schedule;
	 	//if (!tasks.some(task => task.taskName === 'twitch'))
	 		//await this.client.schedule.create('twitch', '*/2 * * * *', '420911335187152909');
	}

};