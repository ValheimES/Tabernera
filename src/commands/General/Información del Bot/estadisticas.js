const { Command, version: klasaVersion, Duration } = require('../../../index');
const { version: discordVersion } = require('discord.js');
const { uptime } = require('os');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['estadísticas'],
			guarded: true,
			description: (message) => message.language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	run(msg) {
		return msg.sendCode('asciidoc', [
			'= ESTADÍSTICAS =',
			`• Usuarios      :: ${this.client.users.size.toLocaleString()}`,
			`• Canales       :: ${this.client.channels.size.toLocaleString()}`,
			`• Node.js       :: ${process.version}`,
			`• Discord.js    :: v${discordVersion}`,
			`• Klasa         :: v${klasaVersion}`,
			'',
			'= TIEMPO =',
			`• Host          :: ${Duration.toNow(Date.now() - (uptime() * 1000))}`,
			`• Total         :: ${Duration.toNow(Date.now() - (process.uptime() * 1000))}`,
			'',
			'= USO DEL HOST =',
			`• Uso de la RAM :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
			`• RAM +Node     :: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
		].join('\n'));
	}

};
