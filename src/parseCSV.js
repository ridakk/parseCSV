/**
 * CSV Parser.  Takes a string as input and returns
 * an array of arrays (for each row).
 *
 * @param input String, CSV input
 * @param separator String, single character used to separate fields.
 *        Defaults to ","
 * @param quote String, single character used to quote non-simple fields.
 *        Defaults to "\"".
 */
export function parseCSV(input, separator, quote) {
    var result = [
            ['']
        ],
        char, nextChar,
        rowIndex = 0,
        columnIndex = 0,
        i,
        inputLength = input.length,
        quoteField = false;

    separator = separator || ',';
    quote = quote || '"';

    for (i = 0; i < inputLength; i++) {
        char = input[i];
        nextChar = input[i + 1];

        if (char === quote && !quoteField) {
            quoteField = true;
            continue;
        }

        if (char === quote && quoteField && nextChar === quote) {
            result[rowIndex][columnIndex] += quote;
            i++;
            continue;
        }

        if (char === quote && quoteField &&
            (nextChar === separator || nextChar === '\n' || !nextChar)) {
            quoteField = false;
            continue;
        }

        if (char === '\n' && !quoteField) {
            rowIndex++;
            columnIndex = 0;
            result[rowIndex] = [];
            result[rowIndex][columnIndex] = '';
            continue;
        }

        if (char === separator && !quoteField) {
            columnIndex++;
            result[rowIndex][columnIndex] = '';
            continue;
        }

        result[rowIndex][columnIndex] += char;
    }

    return result;
}
