import {Month} from '@/types/types';
import {format} from 'date-fns';
import {it} from 'date-fns/locale';

export const useMonths = () => {

    const MAX_NUMBER_OF_MONHTS = import.meta.env.VITE_MAX_NUMBER_OF_MONTHS;

    const populate = (startingMonth: number, startingYear: number) => {
        const startDate = new Date(startingYear, startingMonth);
        const currentDate = new Date();
        const datePointer = new Date(startDate);
        const monthsArray: Month[] = [];

        while (datePointer <= currentDate && monthsArray.length < MAX_NUMBER_OF_MONHTS) {
            const month = datePointer.getMonth();
            const year = datePointer.getFullYear();
            monthsArray.push({
                label: format(datePointer, 'LLLL yyyy', {locale: it}).toUpperCase(),
                month,
                year,
            });
            datePointer.setMonth(datePointer.getMonth() + 1);
        }
        return monthsArray.reverse();
    };

    return {populateArray: populate};
};