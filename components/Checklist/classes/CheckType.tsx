import React from 'react';
import uuid from 'react-native-uuid';

abstract class CheckType {
    question: string;
	value: string;
	private _id: string;

    constructor(question?: string, value?: string) {
		this.question = question ? question : "";
		this.value = value ? value : "";
		this._id = uuid.v4() as string;
	};

    getId() {
        return this._id;
    };

    updateCheck(value: string) {
        this.value = value;
    }

    abstract toJSON(): Object;

    abstract renderCreatorForm(deleteCheck: Function, setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>): React.ReactNode;

    abstract renderEditableForm(): React.ReactNode;

    static handleTextChange(text: string, id: string, setChecks: React.Dispatch<React.SetStateAction<CheckType[]>>) {
        setChecks(prevChecks => {
            const newChecks = [...prevChecks];
            for (let i = 0; i < prevChecks.length; i++) {
                if (prevChecks[i].getId() === id) {
                    newChecks[i].question = text;
                }
            }
            return newChecks;
        });
    };
};

export default CheckType;