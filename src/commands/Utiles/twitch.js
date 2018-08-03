const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			guarded: true,
			subcommands: true,
			description: 'Añade a un streamer',
			extendedHelp: '+twitch añadir/quitar <@StartForKiller#8184> <StartForKiller>',
			usage: '<añadir|quitar|lista> [usuario:user] [nombreCuentaTwitch:str]',
			comando: '+twitch',
			usageDelim: ' '
		});
	}

	async añadir(msg, [usuario, nombreCuentaTwitch]) {
		const r = this.client.providers.default.db;
		const { streamer } = msg.guild.configs.roles;
		const { general } = msg.guild.configs.channels;

		await r.table('streamers')
			.insert({ id: usuario.id, nombreCuentaTwitch: nombreCuentaTwitch });
		await msg.guild.members.get(usuario).roles
			.add(msg.guild.roles.get(streamer));
		return msg.guild.channels.get(general)
			.send(`<:tic:408639986934480908> La cuenta _${nombreCuentaTwitch}_ ha sido agregada correctamente a nuestra base de datos. ${usuario} ha recibido el rol de Streamer. Ahora cada vez que retransmita un vídeo de Sea of Thieves se publicará en <#407286482554847242>.`);
	}

	async quitar(msg, [usuario, nombreCuentaTwitch]) {
		const r = this.client.providers.default.db;
		const { streamer } = msg.guild.configs.roles;
		const { general } = msg.guild.configs.channels;
		const nombre = r.table('streamers').get(usuario.id)('nombreCuentaTwitch').default(null);
		if (!nombre) throw `No existe en la base de datos`;

		await r.table('streamers').get(usuario.id)
			.delete();
		await msg.guild.members.get(usuario).roles
			.remove(msg.guild.roles.get(streamer));
		return msg.guild.channels.get(general)
			.send(`<:no:432891007366070272> La cuenta _${nombreCuentaTwitch}_ ha sido eliminada de nuestra base de datos y ${usuario} ahora ya no es Streamer.`);
	}

	async lista(msg) {
		const r = this.client.providers.default.db;
		const tabla = await r.table('streamers');
		const cuentas = [], usuarios = [];
		let i = 1;
		for (const entrada of tabla) {
			cuentas.push(`${i++}. ${entrada.nombreCuentaTwitch}`);
			usuarios.push(await msg.guild.members.fetch(entrada.id)
				.then(member => member.displayName)
				.catch(() => entrada.id));
		}

		return msg.sendEmbed(new MessageEmbed()
			.setTitle('<:twitch:473533904457039872> Lista de streamers')
			.setColor(8478656)
			.addField('Cuenta:', cuentas.join('\n'), true)
			.addField('Usuario:', usuarios.join('\n'), true));
	}

};
