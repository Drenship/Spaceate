export function formatChartDate(input: string) {
    const monthNames = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];

    const [datePart, timePart] = input.split(':');
    const [year, month, day] = datePart.split('-').map(Number);

    // Créer un objet Date en utilisant le constructeur avec les arguments année, mois et jour
    // Notez que les mois sont indexés à partir de zéro, donc nous soustrayons 1 du mois
    const date = new Date(Date.UTC(year, month - 1, day));

    const formattedMonth = monthNames[date.getUTCMonth()];
    const formattedDay = date.getUTCDate();

    return `${formattedMonth} ${formattedDay}`;
}

export function getLastSevenDaysDateUTC() {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 7);
    date.setUTCHours(0, 0, 0, 0); // Réinitialiser les heures, minutes, secondes et millisecondes UTC à zéro
    return date;
}