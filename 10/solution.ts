import {FileReader} from "../utils/FileReader";

const FILE_PATH = "10/input.txt";

type Pipe = "." | "|" | "-" | "L" | "J" | "7" | "F" | "S";
type RelativePosition = "left" | "right" | "top" | "bottom";
type Point = { x: number, y: number };

function getPositionOf(pipe: Pipe, lines: string[]) {
    for (let y = 0; y < lines.length; y++) {
        let x = lines[y].indexOf(pipe);

        if (x !== -1) {
            return { x, y }
        }
    }
}

function arePipesConnected(source: Pipe, target: Pipe, targetRelativePosition: RelativePosition) {
    switch (targetRelativePosition) {
        case "bottom":
            return ["S", "|", "7", "F"].includes(source) && ["|", "L", "J"].includes(target);

        case "top":
            return ["S", "|", "L", "J"].includes(source) && ["|", "F", "7"].includes(target);

        case "left":
            return ["S", "-", "7", "J"].includes(source) && ["-", "F", "L"].includes(target);

        case "right":
            return ["S", "-", "F", "L"].includes(source) && ["-", "7", "J"].includes(target);
    }
}

function discoverPipeShape(sourceMap: Pipe[][], location: Point) {
    const { x, y } = location;
    const connectsOnLeft = arePipesConnected(sourceMap[y][x], sourceMap[y][x - 1], "left");
    const connectsOnRight = arePipesConnected(sourceMap[y][x], sourceMap[y][x + 1], "right");
    const connectsOnBottom = arePipesConnected(sourceMap[y][x], sourceMap[y + 1][x], "bottom");
    const connectsOnTop = arePipesConnected(sourceMap[y][x], sourceMap[y - 1][x], "top");

    if (connectsOnLeft && connectsOnRight) return "-";
    else if (connectsOnLeft && connectsOnBottom) return "7";
    else if (connectsOnLeft && connectsOnTop) return "J";
    else if (connectsOnRight && connectsOnBottom) return "F";
    else if (connectsOnRight && connectsOnTop) return "L";
    else if (connectsOnBottom && connectsOnTop) return "|";
    else return null;
}

function isValidPosition(map: Pipe[][], position: Point) {
    const { x, y } = position;
    const width = map[0].length;
    const length = map.length;

    if (x < 0 || x >= width || y < 0 || y >= length) {
        return false;
    }

    return [".", "S"].includes(map[y][x]);
}

function extractPipesFromMap(sourceMap: Pipe[][], startingPosition: Point) {
    const { x, y } = startingPosition;
    const vertices = new Array<Point>();
    const width = sourceMap[0].length;
    const length = sourceMap.length;
    const newMap = [...Array(length)].map(() => Array(width));
    let currX = x, currY = y;
    let pipe;
    let steps = 0;

    newMap.forEach((row) => row.fill("."));
    newMap[y][x] = "S";

    while (!(newMap[currY][currX] === "S" && steps)) {
        newMap[currY][currX] = sourceMap[currY][currX];
        vertices.push({ x: currX, y: currY });
        steps++;

        pipe = sourceMap[currY][currX];

        if (isValidPosition(newMap, { x: currX - 1, y: currY }) && arePipesConnected(pipe, sourceMap[currY][currX - 1], "left")) {
            currX--;
        } else if (isValidPosition(newMap, { x: currX, y: currY + 1 }) && arePipesConnected(pipe, sourceMap[currY + 1][currX], "bottom")) {
            currY++;
        } else if (isValidPosition(newMap, { x: currX + 1, y: currY }) && arePipesConnected(pipe, sourceMap[currY][currX + 1], "right")) {
            currX++;
        } else if (isValidPosition(newMap, { x: currX, y: currY - 1 }) && arePipesConnected(pipe, sourceMap[currY - 1][currX], "top")) {
            currY--;
        } else {
            break;
        }
    }

    newMap[y][x] = discoverPipeShape(sourceMap, startingPosition);
    return { map: newMap, steps: Math.ceil(steps / 2), vertices };
}

function calculateLoopArea(vertices: Point[]) {
    let total = 0;

    for (let i = 0, l = vertices.length; i < l; i++) {
        const addX = vertices[i].x;
        const addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
        const subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
        const subY = vertices[i].y;

        total += (addX * addY * 0.5);
        total -= (subX * subY * 0.5);
    }

    return Math.abs(total) - Math.ceil(vertices.length / 2) + 1;
}

function run() {
    const lines = FileReader.getLines(FILE_PATH);
    const positionOfEntrance = getPositionOf("S", lines);

    if (!positionOfEntrance) {
        console.log("Entrance not found!");
        return;
    }

    const oldMap = lines.map((line) => line.split(""));
    const { steps, vertices } = extractPipesFromMap(oldMap as Pipe[][], positionOfEntrance);
    const area = calculateLoopArea(vertices);

    console.log(`STEPS: ${steps}`);
    console.log(`AREA: ${area}`);
}

run();
