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
		await r.table('streamers').insert({ id: usuario.id, nombreCuentaTwitch: nombreCuentaTwitch });
		return msg.send(`<:tic:408639986934480908> La cuenta _${nombreCuentaTwitch}_ ha sido agregada correctamente a nuestra base de datos. ${usuario} ha recibido el rol de Streamer. Ahora cada vez que retransmita un vídeo de Sea of Thieves se publicará en <#407286482554847242>.`);
	}

	async quitar(msg, [usuario, ...nombreCuentaTwitch]) {
		const r = this.client.providers.default.db;
		await r.table('streamers').get(usuario.id).delete();
		return msg.send(`<:no:432891007366070272> La cuenta _${nombreCuentaTwitch}_ ha sido eliminada de nuestra base de datos y ${usuario} ahora ya no es Streamer.`);
	}

	async lista(msg) {
		const r = this.client.providers.default.db;
		const tabla = await r.table('streamers');
		let embed = new MessageEmbed().setTitle('<:twitch:473533904457039872> Lista de streamers')
						.setColor(8478656);
		for(let i = 0; i < tabla.length; i++) {
			let usuario = await msg.guild.members.get(tabla[i].id);
			if (i === 0) {
				embed
				.addField('Cuenta:', `${i + 1}. ${tabla[i].nombreCuentaTwitch}`, true)
				.addField('Usuario:', usuario.displayName, true);
			} else {
				embed
				.addField('\u200B', `${i + 1}. ${tabla[i].nombreCuentaTwitch}`, true)
				.addField('\u200B', usuario.displayName, true);
			}
						
		}
		return msg.send(embed);
	}

};
