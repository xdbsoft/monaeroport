export class Cube {
    dimensions: string[];
    fields: string[];
}
export class Table {
    headers: string[];
    rows: any[];
}

export class OlapFile {
    cube: Cube;
    table: Table;
}
