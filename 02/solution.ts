import {FileReader} from "../utils/FileReader";

const FILE_PATH = "./input.txt";

type CubesSet = {
    red: number;
    blue: number;
    green: number;
}

type Game = {
    id: number;
    sets: CubesSet[];
}

const isBlue = (str: string) => {
    return str.match(/[0-9]+( blue)/g);
}

const isGreen = (str: string) => {
    return str.match(/[0-9]+( green)/g);
}

const isRed = (str: string) => {
    return str.match(/[0-9]+( red)/g);
}

const getSetsFromGameLine = (line: string) => {
    const setLines = line.split(";");

    return setLines.map((setLine: string) => {
        const set: CubesSet = { blue: 0, red: 0, green: 0 };
        const cubeLines = setLine
            .split(", ")
            .map((colorLine: string) => colorLine.trim());

        cubeLines.forEach((cubeLine: string) => {
            const count = parseInt(cubeLine.split(" ")[0]);

            if (isBlue(cubeLine)) {
                set.blue = count;
            } else if (isRed(cubeLine)) {
                set.red = count;
            } else if (isGreen(cubeLine)) {
                set.green = count;
            }
        });

        return set;
    });
}

const combineSubsets = (subsets: CubesSet[]) => {
    const combinedSubset = { blue: 0, red: 0, green: 0 };

    subsets.forEach(({ green, red, blue }) => {
        combinedSubset.green = Math.max(combinedSubset.green, green);
        combinedSubset.red = Math.max(combinedSubset.red, red);
        combinedSubset.blue = Math.max(combinedSubset.blue, blue);
    });

    return combinedSubset;
}

const isGamePossible = (game: Game) => {
    const MAX_BLUE = 14;
    const MAX_GREEN = 13;
    const MAX_RED = 12;

    const { red, green, blue } = combineSubsets(game.sets);

    return red <= MAX_RED && blue <= MAX_BLUE && green <= MAX_GREEN;
}

const run = () => {
    const lines = FileReader.getLines(FILE_PATH);

    const gamesLines = lines.map((line: string) => {
        const beginning = line.indexOf(":") + 2;
        return line.substring(beginning);
    });

    const games: Game[] = gamesLines.map((line: string, index: number) => {
        return { sets: getSetsFromGameLine(line), id: index + 1 };
    })

    let sum = 0;

    games.forEach((game) => {
        const { red, green, blue } = combineSubsets(game.sets);
        sum += red * green * blue;
    })

    console.log(sum);
}

run();
