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

enum Action {
    Approve = 1,
    Reject = 2,
}

enum Role {
    Admin = 1,
    Manager = 2,
    Engineer = 3,
    Specialist = 4,
};

enum ChecklistType {
    Record = "record",
    Template = "template"
};

export {
    ChecklistID, 
    RequestID, 
    Action, 
    Role,
    ChecklistType,
};
