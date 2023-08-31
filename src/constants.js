const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: 5 }, (_, index) => currentYear + index);

export const MONTHS = [
    { key: "January", value: 0 },
    { key: "February", value: 1 },
    { key: "March", value: 2 },
    { key: "April", value: 3 },
    { key: "May", value: 4 },
    { key: "June", value: 5 },
    { key: "July", value: 6 },
    { key: "August", value: 7 },
    { key: "September", value: 8 },
    { key: "October", value: 9 },
    { key: "November", value: 10 },
    { key: "December", value: 11 },
];

export const CATEGORIES = ['FOOD','HEALTH','EDUCATION','TRAVEL','HOUSING','OTHER'];