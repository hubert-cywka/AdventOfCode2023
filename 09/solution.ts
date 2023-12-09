import {FileReader} from "../utils/FileReader";

const FILE_PATH = '09/input.txt';

function processSequence(sequence: number[]) {
    const levels: number[][] = [];
    let newSubsequence = [...sequence];

    while (!isSequenceReady(newSubsequence)) {
        levels.push(newSubsequence);
        newSubsequence = createNextSequence(newSubsequence)
    }

    for (let index = levels.length - 2; index >= 0; index--) {
        const level = levels[index];
        const nextLevel = levels[index + 1];

        level.unshift(level[0] - nextLevel[0]);
        level.push(getLast(level) + getLast(nextLevel));
    }

    return levels[0];
}

function isSequenceReady(sequence: number[]) {
    return !sequence.some((value) => !!value);
}

function getLast<T>(array: T[]) {
    return array[array.length - 1];
}

function createNextSequence(sequence: number[]) {
    const subsequence: number[] = [];

    for (let i = 0; i < sequence.length - 1; i++) {
        subsequence.push(sequence[i + 1] - sequence[i]);
    }

    return subsequence;
}

function readNumbersFromLine(line: string) {
    const numbers = line.split(" ");
    return numbers.map((number) => parseInt(number));
}

function run() {
    const lines = FileReader.getLines(FILE_PATH);
    const sequences = lines.map(readNumbersFromLine);
    const processedSequences = sequences.map((sequence) => processSequence(sequence));
    const resultNext = processedSequences.reduce((sum, current) => sum + getLast(current), 0);
    const resultPrevious = processedSequences.reduce((sum, current) => sum + current[0], 0);

    console.log(resultNext);
    console.log(resultPrevious);
}

run();
