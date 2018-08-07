const { Task } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Task {

	async run() {
		for (const guild of this.client.guilds.values()) {
			this.process(guild)
				.catch(error => this.client.emit('wtf', error));
		}
	}

	async process(guild) {
		const canal = guild.channels.get(guild.configs.channels.twitch);
		if (!canal) return false;

		const r = this.client.providers.default.db;
		const streamers = await r.table('streamers').run();
		if (!streamers.length) return false;

		const channels = streamers.map(usuario => usuario.nombreCuentaTwitch).join(',');

		const url = new URL('https://api.twitch.tv/kraken/streams/');
		url.searchParams.append('channel', channels);
		url.searchParams.append('stream_type', 'live');
		url.searchParams.append('game', 'Sea of Thieves');
		url.searchParams.append('client_id', 'radjtg8zklal4pt79x0xdxfucsk61z');
		const body = await fetch(url).then(result => result.json());

		for (const stream of body.streams) {
			let entry = await r.table('streams').get(stream._id).run();
			let nuevo = false;
			if (!entry) {
				nuevo = true;
				entry = { id: stream._id, createdAt: stream.created_at };
				await r.table('streams').insert(entry);
			}

			if ((nuevo || entry.createdAt !== stream.created_at) && stream.game === 'Sea of Thieves') {
				if (!nuevo) await r.table('streams').get(stream._id).update({ createdAt: stream.created_at });
				const streamerProfile = streamers.find(streamer => streamer.nombreCuentaTwitch === stream.channel.display_name);
				const imagen = streamerProfile ? await guild.members.fetch(streamerProfile.id)
					.then(member => member.user.displayAvatarURL())
					.catch(() => undefined) : undefined;
        
				await canal.send(`¡Arrr piratas!,${stream.channel.display_name} está ahora en vivo en ${stream.channel.url} ¡ve a comprobarlo!\n\n[<@&457852874739679240>]`);
				await canal.send(new MessageEmbed()
					.setAuthor(stream.channel.display_name, imagen)
					.setTitle(stream.channel.status)
					.setURL(stream.channel.url)
					.setThumbnail(stream.channel.logo)
					.setImage(stream.preview.large)
					.addField('Juego:', stream.game, true)
					.addField('Seguidores:', stream.channel.followers, true)
					.setColor(8478656));
			}
		}

		return true;
	}

};
