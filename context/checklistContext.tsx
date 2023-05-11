import React, {createContext} from "react";
import ChecklistEditableForm from "../components/Checklist/ChecklistFillableForm";
import ChecklistSection from "../components/Checklist/classes/ChecklistSection";

const ChecklistEditableFormContext = createContext(null);

const ChecklistEditableContext = (sections : ChecklistSection[], setSections: React.Dispatch<React.SetStateAction<ChecklistSection[]>>) => {
    return <ChecklistEditableFormContext.Provider value={{ sections, setSections }}>
        <ChecklistEditableForm />
    </ChecklistEditableFormContext.Provider>
}

export { ChecklistEditableFormContext };
export default ChecklistEditableContext;