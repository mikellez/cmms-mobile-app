import React, {createContext} from "react";
import ChecklistEditableForm from "../components/Checklist/ChecklistFillableForm";
import ChecklistSection from "../components/Checklist/classes/ChecklistSection";

const ChecklistEditableFormContext = createContext(null);

const ChecklistEditableContext = ({sections, setSections, isDisabled}: 
    {
        sections: ChecklistSection[], 
        setSections: React.Dispatch<React.SetStateAction<ChecklistSection[]>>, 
        isDisabled?: boolean}
) => {
    return <ChecklistEditableFormContext.Provider value={{ sections, setSections, isDisabled }}>
        <ChecklistEditableForm />
    </ChecklistEditableFormContext.Provider>
}

export { ChecklistEditableFormContext };
export default ChecklistEditableContext;