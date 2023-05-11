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

    updateSection(rowId: string, checkId: string, value: string) {
        this.rows.forEach(row => {
			if (row.getId() === rowId) row.updateRow(checkId, value)
		})
    };

    static fromJSON(json: any) {
        return new ChecklistSection(json.description, json.rows.map(row => ChecklistRow.fromJSON(row)))
    };
};


export default ChecklistSection;