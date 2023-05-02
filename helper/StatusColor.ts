const getChecklistStatusColor = (status: number): string => {
    switch (status) {
        case 1:
            return "#b306ec";
        case 2: 
        case 3: 
            return "blue";
        case 4:
        case 5:
            return "#0ebd05";
        default:
            return "red";
    }
};

export { 
    getChecklistStatusColor, 
};
