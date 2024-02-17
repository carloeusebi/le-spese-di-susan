import {Month} from '@/types/types';

export const useMonths = (startingMonth: number, startingYear: number): Month[] => {
    const monthLabels = [
        'gennaio',
        'febbraio',
        'marzo',
        'aprile',
        'maggio',
        'giugno',
        'luglio',
        'agosto',
        'settembre',
        'ottobre',
        'novembre',
        'dicembre',
    ];

    const populateMonths = () => {
        const startDate = new Date(startingYear, startingMonth);
        const currentDate = new Date();
        const monthsArray: Month[] = [];
        const datePointer = new Date(startDate);

        while (datePointer <= currentDate && monthsArray.length <= 24) {
            const month = datePointer.getMonth();
            const year = datePointer.getFullYear();

            monthsArray.push({
                label: `${monthLabels[month].toUpperCase()} ${year}`,
                month,
                year,
            });

            datePointer.setMonth(datePointer.getMonth() + 1);
        }
        return monthsArray;
    };

    return populateMonths();
};