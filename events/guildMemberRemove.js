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
		channel.send(`\`\`\`fix\nDECIDIÓ NAVEGAR POR OTROS MARES LEJANOS\n\`\`\`\n<:barco:406838651771682818> **Su barco desaparece por el horizonte**\n\n_El pirata ${member} se va de la <#375828283704475649> ¡partid con viento fresco!_ 👋🏽\n\nhttp://gph.is/2GfPizB\n`);
	}

};
