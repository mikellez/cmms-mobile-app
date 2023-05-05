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

    // toJSON() {
        
    // };

    // static fromJSON(json: string) {

    // };
};


export default ChecklistSection;