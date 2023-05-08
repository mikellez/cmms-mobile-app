import ChecklistRow from "./ChecklistRow";
import uuid from 'react-native-uuid';


class ChecklistSection {
    private _id: string;
    description: string;
    rows: ChecklistRow[];

    constructor(description?: string, rows?: ChecklistRow[]) {
        this._id = uuid.v4() as string;
        this.description = description ? description : "";
        this.rows = rows ? rows : [];
    };

    getId () {
        return this._id;
    };

    toJSON() {
        return {
            "description": this.description,
            "rows": this.rows.map(row => row.toJSON()),
        };
    };

    addRow(row?: ChecklistRow) {
        const newRow = row ? row : new ChecklistRow();
        this.rows.push(newRow);
    };
    
    removeAllRows() {
        this.rows = [];
    };
    // static fromJSON(json: string) {

    // };
};


export default ChecklistSection;