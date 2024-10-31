export const  formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDateTime = date.toISOString().replace('T', ' ').slice(0, 19);
    return formattedDateTime;
};