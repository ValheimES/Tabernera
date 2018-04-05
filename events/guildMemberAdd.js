const { Event } = require('klasa');
module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true
		});
	}
	run(member) {
		const channel = member.guild.channels.get('405850852411179040');
		if (!channel) return;
		channel.send(
			`\`\`\`fix\n¡AHOY PIRATA!\n\`\`\`\n<:barco:406838651771682818> **¡Un nuevo barco acaba de atracar en el puerto!**\n\n_El pirata ${member} entra de un portazo en la <#375828283704475649> sediento de una buena jarra de grog_ <:jarra:406906694766034947>\n\nhttp://gph.is/2Gd8vlD\n`
		);
	}

};
