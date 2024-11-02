export const formatPostDate = (createdAt) => {
	const currentDate = new Date();
	const createdAtDate = new Date(createdAt);

	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		// Muestra la fecha en formato día/mes/año
		return createdAtDate.toLocaleDateString("es-ES", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	} else if (timeDifferenceInDays === 1) {
		return "Hace 1 día";
	} else if (timeDifferenceInHours >= 1) {
		return `Hace ${timeDifferenceInHours} horas`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `Hace ${timeDifferenceInMinutes} minutos`;
	} else {
		return "Justo ahora";
	}
};

export const formatMemberSinceDate2 = (createdAt) => {
	const date = new Date(createdAt);
	const months = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	return `Creado en ${month} de ${year}`;
};