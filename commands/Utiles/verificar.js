const Comando = require('../../estructuras/Comando');

module.exports = class extends Comando {

	constructor(...args) {
            super(...args, {
                name: 'verificar',
                runIn: ['text'],
                permLevel: 4,
                description: 'Verifica a un usuario cambiandole el nombre ',
                usage: '<usuario:User> <rol:str> <nombre:str> [...]',
                usageDelim: ' ',
                extendedHelp: '+verificar @Chorizo @Insider Pepito',
                comando: '+verificar <Usuario> <Rol> <Nombre>'
            });
        }

	async run(msg, [user, rol, ...nombre]) {

		var taberna = this.client.channels.get("375828283704475649");

		if(!nombre)
		{
			nombre = user.name;
		}
		const MySql = await this.client.providers.get('MySQL');
		
		let member = msg.mentions.members.first();
		
		if (rol == "Pionero")
		{
			member.addRole(msg.guild.roles.find('name', 'Pionero'));
			member.addRole(msg.guild.roles.find('name', 'Fundador'));
			member.addRole(msg.guild.roles.find('name', 'Insider'));
		} else if(rol == "Fundador")
		{
			member.addRole(msg.guild.roles.find('name', 'Fundador'));
			member.addRole(msg.guild.roles.find('name', 'Insider'));
		} else if(rol == "Insider")
		{
			member.addRole(msg.guild.roles.find('name', 'Insider'));
		} else {
			return msg.channel.send("Has escrito mal el nombre de el rol");
		}
			
		member.setNickname(nombre);

                if(MySql.insert2("Verificacion", ['UserID', 'Rango'], [`${user.id}`, `${rol.name}`]))
		{

		}

		return taberna.send("<:tic:408639986934480908> **¡Cuenta verificada!:** _" + user + " , ahora puedes disfrutar de las ventajas de la verificación. Haz click aquí­ para más <#424868390654443520>._");
        
	}

};
