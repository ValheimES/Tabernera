const DATE_FORMAT = /\d{1,2}\/\d{1,2}\/\d{4}/;
const HOUR_FORMAT = /\d{1,2}:\d{1,2}/;
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class Util {

	static validaFecha(fecha) {
		if (!DATE_FORMAT.test(fecha)) throw 'Error de formato, la fecha debe tener el siguiente formato: dd/mm/yyyy';
		const [día, mes, año] = fecha.split('/').map(Number);
		if (mes > 12 || (mes === 2 && día === 29 && !Util.esAñoBisiesto(año)) || MONTH_DAYS[mes] < día)
			throw 'Error de validación, ¡asegúrate de que la fecha es correcta!';

		return [día, mes, año];
	}

	static validaHora(horas) {
		if (!HOUR_FORMAT.test(horas)) throw 'Error de formato, la hora debe tener el siguiente formato: hh:mm';
		const [hora, minuto] = horas.split(':').map(Number);
		if (hora > 60 || minuto > 60) throw 'Error de validación, ¡asegúrate de que la hora es correcta!';

		return [hora, minuto];
	}

	static esAñoBisiesto(año) {
		return ((año % 4 === 0) && (año % 100 !== 0)) || (año % 400 === 0);
	}

}

Util.DATE_FORMAT = DATE_FORMAT;
Util.HOUR_FORMAT = HOUR_FORMAT;
Util.MONTH_DAYS = MONTH_DAYS;

module.exports = Util;
