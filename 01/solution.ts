import {FileReader} from "../utils/FileReader";

const fs = require("fs");

const FILE_PATH = "./input1.txt";

const dictionary = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
};

const isSubstringOfNumber = (maybeSubstring) => {
    const numbers = Object.keys(dictionary);
    return numbers.some((number) => number.startsWith(maybeSubstring));
}

const findSubstringOfNumber = (word) => {
    let newWord = word;

    while (newWord.length > 0) {
        newWord = newWord.slice(1);

        if (isSubstringOfNumber(newWord)) {
            return newWord;
        }
    }

    return "";
}

const getLineResult = (line) => {
    let first = -1, last = -1;
    let word = "";

    line.split("").forEach((character) => {
        let digit = parseInt(character);

        if (!isNaN(digit)) {
            word = "";
            last = digit;

            if (first === -1) {
                first = digit;
            }
        } else {
            word = word.concat(character);

            if (dictionary[word]) {
                digit = dictionary[word];
                last = digit;

                if (first === -1) {
                    first = digit;
                }

                word = character;

            } else if (!isSubstringOfNumber(word)) {
                word = findSubstringOfNumber(word);
            }
        }
    })

    if (first === -1) {
        return 0;
    }

    return first * 10 + last;
}

const lines = FileReader.getLines(FILE_PATH);

let sum = 0;
lines.forEach((line) => {
    sum += getLineResult(line);
});


