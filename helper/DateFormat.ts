

const shortDate = (date: Date): string => {
    const options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    } as any;

    return date.toLocaleDateString("en-GB", options);
};

const shortDateWithDay = (date : Date): string => {
    const options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit", 
    } as any;

    return date.toLocaleDateString("en-GB", options);
}





export {
    shortDate,
    shortDateWithDay
};