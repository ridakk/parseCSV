import { expect } from 'chai';
import { parse } from '../src/parseCSV';

describe("Basic CSV Functionality", () => {
    it("should handle an empty file", () => {
        var input = "";
        var output = [
            ['']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle a single row", () => {
        var input = "1,2,3";
        var output = [
            ['1', '2', '3']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle simple input", () => {
        var input = "1,2,3\n4,5,6";
        var output = [
            ['1', '2', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle empty fields", () => {
        var input = "1,,3\n4,5,\n,7,8";
        var output = [
            ['1', '', '3'],
            ['4', '5', ''],
            ['', '7', '8']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle spaces within fields", () => {
        var input = "1, 2 ,3\n4,5,6";
        var output = [
            ['1', ' 2 ', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle uneven rows", () => {
        var input = "1,2,3,4,5,6\n7,8\n9,10,11,12";
        var output = [
            ['1', '2', '3', '4', '5', '6'],
            ['7', '8'],
            ['9', '10', '11', '12']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle empty rows", () => {
        var input = "1,2,3\n\n4,5,6";
        var output = [
            ['1', '2', '3'],
            [''],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
});

describe("Quoted Fields", () => {
    it("should handle quoted fields", () => {
        var input = "1,\"two was here\",3\n4,5,6";
        var output = [
            ['1', 'two was here', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle empty quoted fields", () => {
        var input = "1,\"\",3\n4,5,6";
        var output = [
            ['1', '', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle leading and trailing spaces in quoted fields", () => {
        var input = "1,\" two \",3\n4,5,6";
        var output = [
            ['1', ' two ', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle separators in quoted fields", () => {
        var input = "1,\"two, too\",3\n4,5,6";
        var output = [
            ['1', 'two, too', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle multi-line quoted fields", () => {
        var input = "1,\"two was\nup there\",3\n4,5,6";
        var output = [
            ['1', 'two was\nup there', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle multiple separators in multiline quoted fields", () => {
        var input = "one,\",,,,,..two,,,,,\n,,,,,,\",three\n4,,6";
        var output = [
            ['one', ',,,,,..two,,,,,\n,,,,,,', 'three'],
            ['4', '', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
    it("should handle quote characters within quoted fields", () => {
        var input = "1,\"two \"\"quote\"\"\",3\n4,5,6";
        var output = [
            ['1', 'two "quote"', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input)).to.deep.equal(output);
    });
});

describe("Alternate Characters", () => {
    it("should handle alternate separators", () => {
        var input = "1\t2\t\"3\tthree\"\n4\t5\t6";
        var output = [
            ['1', '2', '3\tthree'],
            ['4', '5', '6']
        ];
        expect(parse(input, '\t')).to.deep.equal(output);
    });

    it("should handle alternate quotes", () => {
        var input = "1,2,3\n4,'this ''is''\na test',6";
        var output = [
            ['1', '2', '3'],
            ['4', 'this \'is\'\na test', '6']
        ];
        expect(parse(input, ',', "'")).to.deep.equal(output);
    });
});

describe("Regular Expression Special Characters", () => {
    it("should handle using a dot (.) as a field separator", () => {
        var input = "1.2.3\n4.5.6";
        var output = [
            ['1', '2', '3'],
            ['4', '5', '6']
        ];
        expect(parse(input, '.')).to.deep.equal(output);
    });

    it("should handle using a dollar sign ($) as a quote character", () => {
        var input = "$a $$string$$ using $$ as the quote$.$multi\nline$.\n$1.2$.3.4";
        var output = [
            ['a $string$ using $ as the quote', 'multi\nline', ''],
            ['1.2', '3', '4']
        ];
        expect(parse(input, '.', '$')).to.deep.equal(output);
    });

    it("should handle using a backslash (\\) as the quote", () => {
        var input = "\\a \\\\string\\\\ using \\\\ as the quote\\.\\multi\nline\\.\n1.2.\\3.4\\";
        var output = [
            ['a \\string\\ using \\ as the quote', 'multi\nline', ''],
            ['1', '2', '3.4']
        ];
        expect(parse(input, '.', '\\')).to.deep.equal(output);
    });
});

describe("Random Input", () => {
    var randomString = () => {
            var ret = '';
            while (ret.length < 5) {
                ret += 'bcdfghijklmnpqrstvwxz' [Math.floor(Math.random() * 20)];
            }
            return ret;
        },
        output = [],
        input, arr;
    while (output.length < 3) {
        arr = [];
        while (arr.length < 6) arr.push(randomString());
        output.push(arr);
    }
    input = output.map(function(a) {
        return a.join(','); }).join('\n');
    it("should handle random input", () => {
        expect(parse(input)).to.deep.equal(output);
    });
});
