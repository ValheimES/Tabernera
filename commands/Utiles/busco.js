const Comando = require("../../estructuras/Comando");
const Discord = require('discord.js');

module.exports = class extends Comando {

constructor(...args) {
        super(...args, {
	    permlevel: 4,
            cooldown: 15,
	    requiredSettings: ['busco'],
            description: "Por añadir",
            extendedHelp: "+busco",
            comando: "+busco",
            });
    }

    async run(msg) {
	const voiceChannel = msg.member.voiceChannel;
	if(!voiceChannel)
		return msg.send('**' + msg.author + ' debes conectarte a un barco para pedir tripulación.** 🚢');
	if(msg.guid !== voiceChannel.guid)
		return msg.send('**' + msg.author + ' debes conectarte a un barco para pedir tripulación.** 🚢');
	if(voiceChannel.full)
		return msg.send('**' + msg.author + ' no puedes pedir más tripulantes ¡tu barco ya está lleno!** 🚫');

	const usuariosNecesarios = voiceChannel.userLimit - voiceChannel.members.array().length;
	const canal = msg.guild.channels.get(msg.guild.configs.busco);
	
	const embedBarco = new Discord.MessageEmbed()
                .setColor(0x00ced1)
                .addField(`_Busco **${usuariosNecesarios}** ${(usuariosNecesarios === 1) ? 'pirata' : 'piratas'} en el barco ${voiceChannel.name} para zarpar._ 🚢`);

	canal.send('**' + msg.author + ' dice:**')
	canal.send(embedBarco);	
	canal.send('[<@&430418605423853568>]');
	voiceChannel.createInvite().then(invite => canal.send(invite.url));	
	
	return true;
    }

};
