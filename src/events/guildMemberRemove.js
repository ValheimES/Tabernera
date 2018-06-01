const { Event, util: { codeBlock } } = require('../index');

module.exports = class extends Event {

	run(member) {
		const channel = member.guild.channels.get(member.guild.configs.channels.puerto);
		if (channel) {
			channel.send([
				codeBlock('fix', 'DECIDIÓ NAVEGAR POR OTROS MARES LEJANOS'),
				'\n',
				'<:barco:406838651771682818> **Su barco desaparece por el horizonte**',
				'\n',
				'_El pirata ${member} se va de la <#375828283704475649> ¡partid con viento fresco!_ 👋🏽',
				'\n',
				'http://gph.is/2GfPizB'
			].join('\n'));
		}
	}

};
