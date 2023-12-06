import {FileReader} from "../utils/FileReader";

const FILE_PATH = '06/input.txt';

type Race = {
    timeLimit: number;
    recordDistance: number;
}

const readValuesFromLine = (line: string) => {
    const regex = /a*([0-9]+)/g;
    const match = line.match(regex);

    if (!match) {
        return [];
    }

    return match.map((value) => parseInt(value)).filter((value) => !isNaN(value));
}


const readValuesFromLineAsSingleNumber = (line: string) => {
    const regex = /a*([0-9]+)/g;
    const match = line.match(regex);

    if (!match) {
        return 0;
    }

    return parseInt(match.filter((value) => value.length).join(""));
}

const mapTimeAndDistanceToRace = (time: number, distance: number) => {
    return {
        timeLimit: time,
        recordDistance: distance
    }
}

const calculateDistance = (durationTime: number, chargeTime: number) => {
    return (durationTime - chargeTime) * chargeTime;
}

const calculateNumberOfWaysToBeatTheRecord = (race: Race) => {
    const { timeLimit, recordDistance } = race;
    let counter = 0;

    for (let chargeTime = 1; chargeTime < timeLimit; chargeTime++) {
        if (calculateDistance(timeLimit, chargeTime) > recordDistance) {
            counter++;
        }
    }

    return counter;
}

const runPart1 = () => {
    const lines = FileReader.getLines(FILE_PATH);

    const times = readValuesFromLine(lines[0]);
    const distances = readValuesFromLine(lines[1]);

    const result = times
        .map((time, index) => mapTimeAndDistanceToRace(time, distances[index]))
        .map((race) => calculateNumberOfWaysToBeatTheRecord(race))
        .reduce((sum, num) => sum * num, 1);

    console.log(result);
}

const runPart2 = () => {
    const lines = FileReader.getLines(FILE_PATH);

    const time = readValuesFromLineAsSingleNumber(lines[0]);
    const distance = readValuesFromLineAsSingleNumber(lines[1]);

    const race = mapTimeAndDistanceToRace(time, distance);
    const result = calculateNumberOfWaysToBeatTheRecord(race);

    console.log(result);
}

runPart1();
runPart2();
