const { Event, util: { codeBlock } } = require('../index');

module.exports = class extends Event {

	run(guild, user) {
		const channel = guild.channels.get(guild.configs.channels.puerto);
		if (channel) {
			channel.send([
				codeBlock('fix', 'PASEÓ POR LA PLANCHA'),
				'\n<:barco:406838651771682818> **¡Alto ahí! Más os vale saltar por la borda**',
				`\n_El pirata ${user} es condenado a criar malvas devorado por los tiburones por traidor. Sus restos son recuperados y usados para decorar la <#375828283704475649>._ 🦈`,
				'\nhttp://gph.is/2Ged67e'
			].join('\n'));
		}
	}

};
