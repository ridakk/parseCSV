# CSV Parser
A CSV (Comma-Separated Values) file is a file that represents tabular data in a simple, text-only manner. At it's simplest, a CSV file contains rows of data separated by newlines, and each field is separated by commas.

This parser handles CSVs using commas to delimit fields, but handles complex field values (which may be wrapped in quotes, and may span multiple lines), and also different delimiters and quote characters.

## Examples

A simple CSV would look like this:
```
a,b,c
d,e,f
```

becomes

```
[['a', 'b', 'c'], ['d', 'e', 'f']
```

While a more complex one might be:

```
one,"two wraps
onto ""two"" lines",three
4,,6
```

becomes

```
[['one', 'two wraps\nonto "two" lines', 'three'], ['4', '', '6']]
```