const { Task } = require('klasa');
const { Application } = require('twitterer.js');
const config = require('../../config.js');
const app = new Application({
	consumerKey: config.consumerKey,
	consumerSecret: config.consumerSecret
});

module.exports = class extends Task {

	async run() {
		for (const guild of this.client.guilds.values()) {
			this.process(guild)
				.catch(error => this.client.emit('wtf', error));
		}
	}

	async process(guild) {
		const canal = guild.channels.get(guild.configs.channels.twitter);
		if (!canal) return false;

		const r = this.client.providers.default.db;

		// pasarlo a base de datos
		const usuarios = await r.table('twitter').run();
		if (!usuarios.length) return false;

		for (usuario of usuarios) {
			// eslint-disable-next-line camelcase
			const body = await app.get('statuses/user_timeline', { params: { screen_name: usuario.id } }).then(result => result);

			for (post of body) {
				let entry = await r.table('tweets').get(post.id_str).run();
				let nuevo = false;
				if (!entry) {
					nuevo = true;
					entry = { id: post.id_str, createdAt: post.created_at };
					await r.table('tweets').insert(entry);
				}

				if (nuevo || entry.createdAt !== post.created_at) {
					if (!nuevo) await r.table('tweets').get(post.id_str).update({ createdAt: post.created_at });
					await canal.send(`<:twitter:406776059334492160> **TWEET RECIBIDO**\n\n[<@&406836360243052545>]\n\nhttps://twitter.com/statuses/${body[j].id_str}`);
				}
			}
		}

		return true;
	}

};
