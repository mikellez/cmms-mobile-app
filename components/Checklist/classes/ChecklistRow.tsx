import uuid from 'react-native-uuid';
import CheckType from './CheckType';

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
            "checks": [],
        };
    };

    addCheck(check: CheckType) {
        this.checks.push(check);
    };

    removeAllChecks() {
        this.checks = [];
    };
};

export default ChecklistRow;