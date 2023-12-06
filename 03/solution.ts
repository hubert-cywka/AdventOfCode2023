import {FileReader} from "../utils/FileReader";

const FILE_PATH = "03/input.txt";

type Coordinate = { x: number, y: number };

const isNullOrUndefined = (value: unknown) => {
    return value === undefined || value === null;
}

const isDigit = (char: string) => {
    return char <= "9" && char >= "0";
}

const isSymbol = (char: string) => {
    return !isDigit(char) && char !== ".";
}

const getBounds = (line: number, from: number, to: number, lines: string[]) => {
    const lineLength = lines[line].length;
    const topBound = Math.max(line - 1, 0);
    const bottomBound = Math.min(line + 1, lines.length - 1);
    const leftBound = Math.max(from - 1, 0);
    const rightBound = Math.min(to + 1, lineLength - 1);

    return { topBound, bottomBound, leftBound, rightBound };
}

const isAdjacentToSymbol = (line: number, from: number, to: number, lines: string[]) => {
    const { topBound, bottomBound, leftBound, rightBound } = getBounds(line, from, to, lines);

    for (let i = leftBound; i <= rightBound; i++) {
        if (
            isSymbol(lines[line].charAt(i))
            || topBound !== line && isSymbol(lines[topBound].charAt(i))
            || bottomBound !== line && isSymbol(lines[bottomBound].charAt(i))
        ) {
            return true;
        }
    }

    return false;
}

const isAdjacentToCoordinate = (line: number, from: number, to: number, lines: string[], coordinate: Coordinate) => {
    const { topBound, bottomBound, leftBound, rightBound } = getBounds(line, from, to, lines);

    for (let i = leftBound; i <= rightBound; i++) {
        for (let j = topBound; j <= bottomBound; j++) {
            if (coordinate.x === i && coordinate.y === j) {
                return true;
            }
        }
    }

    return false;
}

const countAdjacentNumbers = (line: number, column: number, lines: string[]) => {
    const { topBound, bottomBound, leftBound, rightBound } = getBounds(line, column, column, lines);
    let digitsMiddle = 0, digitsAbove = 0, digitsBelow = 0;

    const middleRow = [lines[line].charAt(leftBound), lines[line].charAt(rightBound)];
    const upperRow = [lines[topBound].charAt(leftBound), lines[topBound].charAt(column), lines[topBound].charAt(rightBound)];
    const bottomRow = [lines[bottomBound].charAt(leftBound), lines[bottomBound].charAt(column), lines[bottomBound].charAt(rightBound)];

    middleRow.forEach((c) => isDigit(c) && digitsMiddle++);

    if (isDigit(bottomRow[1])) {
        digitsBelow = 1;
    } else {
        bottomRow.forEach((c) => isDigit(c) && digitsBelow++);
    }

    if (isDigit(upperRow[1])) {
        digitsAbove = 1;
    } else {
        upperRow.forEach((c) => isDigit(c) && digitsAbove++);
    }

    return digitsMiddle + digitsBelow + digitsAbove;
}

const runPart1 = () => {
    const lines = FileReader.getLines(FILE_PATH);
    let sum = 0;

    lines.forEach((line: string, lineIndex: number) => {
       let start, end, char;

       for (let i = 0; i <= line.length; i++) {
           char = line.charAt(i);

           if (isDigit(char)) {
               if (isNullOrUndefined(start)) {
                   start = i;
               }
               end = i;
           } else {
               if (typeof start === 'number' && typeof end === 'number' && isAdjacentToSymbol(lineIndex, start, end, lines)) {
                   sum += parseInt(line.substring(start, end + 1));
               }

               start = null;
               end = null;
           }
       }
    });

    console.log(sum);
}


const addToMap = (coordinate: Coordinate, number: number, map: Map<Coordinate, number[]>) => {
    const current = map.get(coordinate);

    if (current) {
        map.set(coordinate, [...current, number]);
    } else {
        map.set(coordinate, [number]);
    }
}

const calculateResult = (map: Map<Coordinate, number[]>) => {
    let result = 0;

    map.forEach((values) => {
        if (values.length === 2) {
            result += values[0] * values[1];
        }
    })

    return result;
}

const runPart2 = () => {
    const lines = FileReader.getLines(FILE_PATH);
    const coordinates: Coordinate[] = [];
    const map = new Map<Coordinate, number[]>();

    lines.forEach((line: string, lineIndex: number) => {
        let char;

        for (let i = 0; i <= line.length; i++) {
            char = line.charAt(i);

            if (char !== "*") {
                continue;
            }

            if (countAdjacentNumbers(lineIndex, i, lines) !== 2) {
                continue;
            }

            coordinates.push({ x: i, y: lineIndex });
        }
    });

    coordinates.forEach((coordinate) => {
        lines.forEach((line: string, lineIndex: number) => {
            let start, end, char;

            for (let i = 0; i <= line.length; i++) {
                char = line.charAt(i);

                if (isDigit(char)) {
                    end = i;

                    if (isNullOrUndefined(start)) {
                        start = i;
                    }

                } else {
                    if (typeof start === 'number' && typeof end === 'number' && isAdjacentToCoordinate(lineIndex, start, end, lines, coordinate)) {
                        const number = parseInt(line.substring(start, end + 1));
                        addToMap(coordinate, number, map);
                    }

                    start = null;
                    end = null;
                }
            }
        });
    });

    console.log(calculateResult(map));
}

runPart1();
runPart2();
