const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			guarded: true,
			subcommands: true,
			description: 'Añade a un usuario de twitter',
			extendedHelp: '+twitter añadir/quitar/lista <SeaOfThievesES>',
			usage: '<añadir|quitar|lista> (nombre:twitter)',
			comando: '+twitter',
			usageDelim: ' '
		});

		this.createCustomResolver('twitter', (arg, possible, msg, [type]) => {
			if (type === 'lista') return undefined;
			return this.client.arguments.get('string').run(arg, possible, msg);
		});
	}

	async añadir(msg, [nombre]) {
		const r = this.client.providers.default.db;

		await r.table('twitter')
			.insert({ id: nombre });
		return msg.send(`Cuenta añadida con exito`);
	}

	async quitar(msg, [nombre]) {
		const r = this.client.providers.default.db;
		const name = await r.table('twitter').get(nombre)('id').default(null);
		if (!name) throw `No existe en la base de datos`;

		await r.table('twitter').get(nombre)
			.delete();
		return msg.send(`Cuenta eliminada con exito`);
	}

	async lista(msg) {
		const r = this.client.providers.default.db;
		const tabla = await r.table('twitter');
		const usuarios = [];
		let i = 1;
		for (const entrada of tabla)
			usuarios.push(`${i++}. ${entrada.id}`);

		return msg.sendEmbed(new MessageEmbed()
			.setTitle('<:twitch:473533904457039872> Lista de usuarios de twitter')
			.setColor(8478656)
			.addField('Usuario:', usuarios.join('\n'), true));
	}

};
