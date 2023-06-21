import React, {createContext} from "react";

const ChecklistEditableFormContext = createContext(null);

const ChecklistEditableProvider = ({sections, setSections, isDisabled, children, sectionsRef}) => {
    return <ChecklistEditableFormContext.Provider value={{ sections, setSections, isDisabled, sectionsRef }}>
        {children}
    </ChecklistEditableFormContext.Provider>
}

const ChecklistCreateFormContext = createContext(null);
const ChecklistCreateContextProvider = ({sections, setSections, level, setLevel, children, sectionsRef}) => {
    return <ChecklistCreateFormContext.Provider value={{ sections, setSections, level, setLevel, sectionsRef }}>
                    {children}
    </ChecklistCreateFormContext.Provider>
}

export { ChecklistEditableFormContext, 
            ChecklistCreateFormContext, 
            ChecklistCreateContextProvider };
export default ChecklistEditableProvider;