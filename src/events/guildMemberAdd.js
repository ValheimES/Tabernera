const { Event, util: { codeBlock } } = require('../index');

module.exports = class extends Event {

	async run(member) {
		const role = member.guild.roles.get(member.guild.configs.roles.inicial[0]);
		if (role) await member.roles.add(role);

		const channel = member.guild.channels.get(member.guild.configs.channels.puerto);
		if (channel) {
			await channel.send([
				codeBlock('fix', '¡AHOY PIRATA!'),
				'\n',
				'<:barco:406838651771682818> **¡Un nuevo barco acaba de atracar en el puerto!**',
				'\n',
				`_El pirata ${member} entra de un portazo en la <#375828283704475649> sediento de una buena jarra de grog_ <:jarra:406906694766034947>`,
				'\n',
				'http://gph.is/2Gd8vlD'
			].join('\n'));
		}
	}

};
