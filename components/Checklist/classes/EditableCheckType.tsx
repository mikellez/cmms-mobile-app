import React from 'react';
import uuid from 'react-native-uuid';

abstract class EditableCheckType {
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

    abstract renderCreatorForm(): React.ReactNode;
};

export default EditableCheckType;