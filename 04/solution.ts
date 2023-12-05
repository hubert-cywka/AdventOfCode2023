import {FileReader} from "../utils/FileReader";

const FILE_PATH = './input.txt';

class ScratchCard {
    private own: number[];
    private winning: number[];
    private copies: number;

    constructor(line: string) {
        const { winning, own } = this.parseInputLine(line);
        this.own = winning;
        this.winning = own;
        this.copies = 1;
    }

    private parseStringOfNumbers = (line: string) => {
        return line.split(" ")
            .map((n) => parseInt(n))
            .filter((n) => !isNaN(n));
    }

    private removeLinePrefix = (line: string) => {
        const indexOfPrefix = line.indexOf(":");
        return line.substring(indexOfPrefix + 2);
    }

    private parseInputLine(line: string) {
        const [winning, own] = this.removeLinePrefix(line).split("|");
        return {
            winning: this.parseStringOfNumbers(winning),
            own: this.parseStringOfNumbers(own),
        }
    }

    private getMatchingNumbers() {
        return this.own.filter((number) => this.winning.includes(number));
    }

    getScore() {
        const ownWinningCount = this.getMatchingNumbers().length;
        return ownWinningCount <= 0 ? 0 : Math.pow(2, ownWinningCount - 1);
    }

    getAmountOMatchingNumbers() {
        return this.getMatchingNumbers().length;
    }

    addCopies(amount: number) {
        this.copies += amount;
    }

    getCopiesAmount() {
        return this.copies;
    }
}

const processScratchCards = (scratchCard: ScratchCard, index: number, scratchCards: ScratchCard[]) => {
    for (let i = index + 1, j = 0; i < scratchCards.length && j < scratchCard.getAmountOMatchingNumbers(); i++, j++) {
        scratchCards[i].addCopies(scratchCard.getCopiesAmount());
    }

    return scratchCard;
}

const runPart1 = () => {
    const result = FileReader
        .getLines(FILE_PATH)
        .map((line) => new ScratchCard(line))
        .reduce((totalValue, scratchCard) => totalValue + scratchCard.getScore(), 0)

    console.log(`PART 1 RESULT: ${result}`);
}

const runPart2 = () => {
    const result = FileReader
        .getLines(FILE_PATH)
        .map((line) => new ScratchCard(line))
        .map(processScratchCards)
        .reduce((totalValue, scratchCard) => totalValue + scratchCard.getCopiesAmount(), 0);

    console.log(`PART 2 RESULT: ${result}`);
}

runPart1();
runPart2();
