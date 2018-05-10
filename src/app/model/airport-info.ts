export class AirportInfo {
    icao: string;
    iata: string;
    name: string;
    range: string;
    pos: any;

    toString(): string {
        if (! ('icao' in this) || this.icao.length == 0) {
            return ""
        }
        return this.icao + ' - ' + this.name;
    }
}
