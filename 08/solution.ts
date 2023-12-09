import {FileReader} from "../utils/FileReader";
import {MathHelpers} from "../utils/MathHelpers";

const FILE_PATH = '08/input.txt';

type Node = {
    key: string;
    leftNode: string;
    rightNode: string;
}

type DesertMap = {
    directions: string[];
    nodes: Map<string, Node>;
}

function mapInputLineToNode(line: string) {
    const regex = /([A-Z])\w+/g;
    const matches = [...line.matchAll(regex)];

    return {
        key: matches[0][0],
        leftNode: matches[1][0],
        rightNode: matches[2][0]
    }
}

function mapInputToSolutionMap(lines: string[]) {
    const directions = lines[0].split("");
    const nodes: Map<string, Node> = new Map<string, Node>();

    for (let lineIndex = 2; lineIndex < lines.length; lineIndex++) {
        let node = mapInputLineToNode(lines[lineIndex]);
        nodes.set(node.key, node);
    }

    return {
        directions,
        nodes
    }
}

function calculateStepsFromTo(map: DesertMap, from: string, to: string) {
    const directionsLength = map.directions.length;
    let numberOfSteps = 0;
    let currentNode = map.nodes.get(from);

    while (currentNode) {
        if (currentNode?.key.endsWith(to)) {
            break;
        }

        let direction = map.directions[numberOfSteps % directionsLength];

        if (direction === "R") {
            currentNode = map.nodes.get(currentNode.rightNode);
        } else {
            currentNode = map.nodes.get(currentNode.leftNode);
        }

        numberOfSteps++;
    }

    return numberOfSteps;
}

function runPart1() {
    const lines = FileReader.getLines(FILE_PATH);
    const desertMap = mapInputToSolutionMap(lines);
    const result = calculateStepsFromTo(desertMap, "AAA", "ZZZ");
    console.log(result);
}

function runPart2() {
    const lines = FileReader.getLines(FILE_PATH);
    const desertMap = mapInputToSolutionMap(lines);
    const startingNodes = [...desertMap.nodes.values()].filter((node) => node.key.endsWith("A"));

    const results = startingNodes.map((node) => calculateStepsFromTo(desertMap, node.key, "Z"));
    const result = results.reduce(MathHelpers.lowestCommonMultiplier);
    console.log(result);
}

runPart1();
runPart2();
