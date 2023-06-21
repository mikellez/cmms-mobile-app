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

const getRequestStatus = (status: string): {color: string} => {
    const STATUS = {
      "PENDING": { color: "rgb(179, 6, 236);"},
      "ASSIGNED": { color: "#0000FC"},
      "COMPLETED": {color: "rgb(14, 189, 5);"},
      "REJECTED": {color: "#ff0000"},
      "APPROVED": {color: "color: rgb(14, 189, 5);"},
    };

    return STATUS[status];
}

export { 
    getChecklistStatusColor, 
    getRequestStatus
};
