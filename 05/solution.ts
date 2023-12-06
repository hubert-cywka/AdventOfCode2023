import {FileReader} from "../utils/FileReader";

const FILE_PATH = '05/input.txt';

type Range = {
    destinationStart: number;
    sourceStart: number;
    length: number;
}

type Step = {
    id: number;
    name: string;
    ranges: Range[];
}

type SeedsRange = {
    from: number;
    to: number;
}

type Almanac = {
    seeds: number[];
    seedsRanges: SeedsRange[];
    steps: Step[];
}

class AlmanacMapper {
    private static seedsRegex = /(seeds: )+a*([0-9 ]+)/g;
    private static rangeRegex = /^a*([0-9 ]+)/g;
    private static nameRegex = /\b\w+(?:-\w+)+\b/g;

    private static isSeeds(line: string) {
        return this.seedsRegex.test(line);
    }

    private static isStepRange(line: string) {
        return this.rangeRegex.test(line);
    }

    private static isStepName(line: string) {
        return this.nameRegex.test(line);
    }

    private static getStepName(line: string) {
        const match = line.match(this.nameRegex);

        if (!match) {
            return "";
        }

        return match[0];
    }

    private static getSeeds(line: string) {
        const match = line.match(this.seedsRegex);

        if (!match) {
            return [];
        }

        return match[0]
            .split(":")[1]
            .split(" ")
            .map((num) => parseInt(num))
            .filter((num) => !isNaN(num));
    }

    private static getStepRange(line: string) {
        const match = line.match(this.rangeRegex);

        if (!match) {
            return {
                destinationStart: 0,
                sourceStart: 0,
                length: 0
            }
        }

        const result = match[0]?.split(" ");

        return {
            destinationStart: parseInt(result[0]),
            sourceStart: parseInt(result[1]),
            length: parseInt(result[2]),
        }
    }

    private static seedsToSeedRanges = (seeds: number[]) => {
        const ranges: SeedsRange[] = [];

        for (let i = 0; i < seeds.length; i += 2) {
            const rangeStart = seeds[i];
            const rangeEnd = seeds[i] + seeds[i + 1] - 1;
            ranges.push({ from: rangeStart, to: rangeEnd });
        }

        return ranges;
    }


    static fromLines(input: string[], options?: { seedRanges?: boolean }) {
        const almanac: Almanac = { seeds: [], steps: [], seedsRanges: [] }

        input
            .forEach((line) => {
            if (this.isStepName(line)) {
                const id = almanac.steps.length + 1;
                const name = this.getStepName(line);
                const ranges: Range[] = [];
                almanac.steps.push({ id, name, ranges });
            } else if (this.isSeeds(line)) {
                const seeds = this.getSeeds(line);

                if (options?.seedRanges) {
                    almanac.seedsRanges.push(...this.seedsToSeedRanges(seeds))
                } else {
                    almanac.seeds.push(...seeds);
                }

            } else if (this.isStepRange(line)) {
                almanac.steps[almanac.steps.length - 1]?.ranges.push(this.getStepRange(line));
            }
        })

        return almanac;
    }
}

const getPossibleRangesForSource = (source: number, step: Step) => {
    return step.ranges.filter((range) => {
        return range.sourceStart <= source && range.sourceStart + range.length > source;
    })
}

const getDestinationForSource = (source: number, step: Step) => {
    const possibleRanges = getPossibleRangesForSource(source, step);

    if (!possibleRanges.length) {
        return source;
    }

    const destinationRange = [...possibleRanges]
        .sort((a, b) => a.destinationStart - b.destinationStart)[0];
    return destinationRange.destinationStart + source - destinationRange.sourceStart;
}

const processAlmanacSeeds = (seeds: number[], steps: Step[]) => {
    steps.forEach((step) => {
        seeds.forEach((seed, index) => {
            seeds[index] = getDestinationForSource(seed, step);
        })
    })

    return seeds;
}

const getOverlappingRanges = (range: SeedsRange, step: Step) => {
    const newRanges: SeedsRange[] = [];

    step.ranges.forEach((stepRange) => {
        const rangeStart = Math.max(stepRange.sourceStart, range.from);
        const rangeEnd = Math.min(stepRange.sourceStart + stepRange.length, range.to);

        if (rangeStart <= rangeEnd) {
            const startOffset = Math.abs(rangeStart - stepRange.sourceStart);
            const rangeLength = rangeEnd - rangeStart;
            const destinationStart = stepRange.destinationStart + startOffset;
            const destinationEnd = stepRange.destinationStart + startOffset + rangeLength - 1;
            newRanges.push({ from: destinationStart, to: destinationEnd });
        }
    })

    if (!newRanges.length) {
        newRanges.push(range);
    }

    return newRanges;
}

const processAlmanacSeedRanges = (seedRanges: SeedsRange[], steps: Step[]) => {
    steps.forEach((step) => {
        const newRanges: SeedsRange[] = [];

        seedRanges.forEach((range) => {
            newRanges.push(...getOverlappingRanges(range, step));
        })

        seedRanges = [...newRanges];
    })

    return seedRanges;
}

const runPart1 = () => {
    const lines = FileReader.getLines(FILE_PATH);
    const almanac = AlmanacMapper.fromLines(lines);
    const processedSeeds = processAlmanacSeeds(almanac.seeds, almanac.steps);
    const lowest = [...processedSeeds].sort((a, b) => a - b)[0];

    console.log(`PART 1 RESULT: ${lowest}`);
}

const runPart2 = () => {
    const lines = FileReader.getLines(FILE_PATH);
    const almanac = AlmanacMapper.fromLines(lines, { seedRanges: true });
    const processedSeeds = processAlmanacSeedRanges(almanac.seedsRanges, almanac.steps);
    const lowest = [...processedSeeds].sort((a, b) => a.from - b.from)[0];

    console.log(`PART 2 RESULT: ${lowest.from}`);
}

runPart1();
runPart2();
