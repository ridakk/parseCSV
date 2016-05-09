import { parseCSV } from './parseCSV';

export default class CSV {

    constructor() {}

    static parse(...params) {
        return parseCSV(...params);
    }

}
