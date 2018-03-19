const Comando = require('../../estructuras/Comando');
const Discord = require('discord.js');

const bot = require("./../../bot");

module.exports = class extends Comando {

    constructor(...args) {
        super(...args, {
            name: 'cuenta',
            runIn: ['text', 'dm', 'group'],
            permLevel: 3,
            description: 'Mira el estado de tu cuenta.',
            extendedHelp: '+cuenta',
            usage: '',
            comando: '+cuenta'
        });
    }


    async run(msg) {
		
		var desc = "";
		const MySql = await this.client.providers.get('MySQL');
		if(await MySql.get("XP", "ID", "" + msg.author.id))
		{
			const base = await MySql.get("XP", "ID", "" + msg.author.id);
			desc = base.XP;
		} else {
			return msg.channel.send("No tienes experiencia todavia");
		}
		
		var lvl = "";
		var lvl_cnt = "0";
		var crr_lvl = "0";
		
		if (parseInt(desc) >= 67525)
		{
			lvl = "Rey pirata";
			lvl_cnt = "Stop";
			crr_lvl = "Stop";
		} else if(parseInt(desc) >= 23850)
		{
			lvl = "Pirata experto";
			lvl_cnt = "67525";
			crr_lvl = String(parseInt(desc) - 23850);
		} else if(parseInt(desc) >= 11825)
		{
			lvl = "Pirata rufián";
			lvl_cnt = "23850";
			crr_lvl = String(parseInt(desc) - 11825);
		} else if(parseInt(desc) >= 4675)
		{
			lvl = "Grumete gallina";
			lvl_cnt = "11825";
			crr_lvl = String(parseInt(desc) - 4675);
		} else if(parseInt(desc) >= 1150)
		{
			lvl = "Rata de mar";
			lvl_cnt = "4675";
			crr_lvl = String(parseInt(desc) - 1150);
		} else {
			lvl = "Limpiacubiertas";
			lvl_cnt = "1150";
			crr_lvl = desc;
		}

        const embedSugerencia = new Discord.MessageEmbed()
        .setColor(0x3785df)
        .setTitle("**Estado de la cuenta @" + msg.author.tag + ":**")
		.addField("<:noticias:406932788428931092> **Total de experiencia:**", "\u0020 \u0020 " + desc, true)
		.addField("<:soporte:406932787908706316> **Nivel:**", "\u0020\u0020" + lvl, true)
		.addField("<:flechaarriba:406932788256702474> **Siguiente nivel:**", "\u0020 \u0020 " + crr_lvl + "/" + lvl_cnt + " exp.", true)
		.addField("<:cofre:406906617284788225> **Monedas de oro:**", "\u0020 \u0020 00", true);

		msg.channel.send({embed : embedSugerencia});
		return msg.delete(2000);
   }

};
