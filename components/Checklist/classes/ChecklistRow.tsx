import uuid from 'react-native-uuid';
import CheckType from './CheckType';
import { SingleChoiceType, MultiChoiceType, FreeTextType, SignatureType, FileUploadType } from '../Checks';

class ChecklistRow {
    private _id: string;
    description: string;
    checks: CheckType[];

    constructor(description?: string, checks?: CheckType[]) {
        this._id = uuid.v4() as string;
        this.description = description ? description : "";
        this.checks = checks ? checks : [];
    };

    getId() {
        return this._id;
    };

    toJSON() {
        return {
            "description": this.description,
            "checks": this.checks.map(check => check.toJSON()),
        };
    };

    addCheck(check: CheckType) {
        this.checks.push(check);
    };

    removeAllChecks() {
        this.checks = [];
    };

    static fromJSON(json: any) {
        return new ChecklistRow(json.description, json.checks.map(check => ChecklistRow.checkFromJSON(check)));
    }

    updateRow(checkId: string, value: string) {
        this.checks.forEach(check => {
			if (check.getId() === checkId) check.updateCheck(value)
		})
    }

    private static checkFromJSON(json: any) {
        switch(json.type) {
            case "SingleChoice":
                return new SingleChoiceType(json.question, json.value, json.choices);
            case "MultiChoice":
                return new MultiChoiceType(json.question, json.value, json.choices);
            case "FileUpload":
                return new FileUploadType(json.question, json.value);
            case "FreeText":
                return new FreeTextType(json.question, json.value);
            case "Signature":
                return new SignatureType(json.question, json.value);
            
        }
    }
};

export default ChecklistRow;