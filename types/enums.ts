enum ChecklistID {
    Pending = 1,
    Assigned = 2,
    WorkDone = 4,
    Approved = 5
}

enum RequestID {
    Pending = 1,
    Assigned = 2,
    Completed = 3,
    Approved = 4,
    Rejected = 5,
    Cancelled = 6
}

export {ChecklistID, RequestID};
