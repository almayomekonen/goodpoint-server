/**
 *
 * @param date  the date to convert to local date
 * @returns a date converted to the local date according to the local timezone
 */
export const convertDateToLocalDate = (date: string | number) => {
    let newDate = new Date(date);
    const timezoneOffset = newDate.getTimezoneOffset() * 1000 * 60;
    newDate = new Date(newDate.getTime() - timezoneOffset);

    return newDate;
};
