const { Event, util: { codeBlock } } = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	run(member) {
		const channel = member.guild.channels.get(member.guild.configs.channels.puerto);
		if (channel) {
			channel.send(new MessageEmbed()
				.setColor(0x7E8584)
				.setImage('https://media.giphy.com/media/3ohs5NvNOK3HREOxAQ/giphy.gif')
				.setDescription([
					codeBlock('fix', 'DECIDIÓ NAVEGAR POR OTROS MARES LEJANOS'),
					'<:barco:406838651771682818> **Su barco desaparece por el horizonte**',
					`\n_El pirata ${member.user.username} se va de la <#375828283704475649> ¡partid con viento fresco!_ 👋🏽`
				].join('\n'))
			);
		}
	}

};
