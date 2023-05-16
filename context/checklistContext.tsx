import React, {createContext} from "react";

const ChecklistEditableFormContext = createContext(null);

const ChecklistEditableProvider = ({sections, setSections, isDisabled, children}) => {
    return <ChecklistEditableFormContext.Provider value={{ sections, setSections, isDisabled }}>
        {children}
    </ChecklistEditableFormContext.Provider>
}

const ChecklistCreateFormContext = createContext(null);
const ChecklistCreateContextProvider = ({sections, setSections, level, setLevel, children}) => {
    return <ChecklistCreateFormContext.Provider value={{ sections, setSections, level, setLevel }}>
                    {children}
    </ChecklistCreateFormContext.Provider>
}

export { ChecklistEditableFormContext, 
            ChecklistCreateFormContext, 
            ChecklistCreateContextProvider };
export default ChecklistEditableProvider;