import {FileReader} from "../utils/FileReader";

const FILE_PATH = "07/input.txt";
const JOKER_SYMBOL = "R";
const CARD_POWERS = {
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    "T": 9,
    "J": 10,
    "Q": 11,
    "K": 12,
    "A": 13,
    [JOKER_SYMBOL]: 0
}

type HandType = "five of a kind" | "four of a kind" | "full house" | "three of a kind" | "two pair" | "one pair" | "high card";

interface ICard {
    getPower: () => number;
    getSymbol: () => string;
    isJoker: () => boolean;
    compare: (card: Card) => number;
}

interface IHand {
    getBid: () => number;
    getPower: () => number;
    getType: () => HandType;
    getTypePower: () => number;
    compare: (hand: Hand) => number;
}

class Card implements ICard {
    private readonly symbol: string;
    private readonly power: number;

    constructor(symbol: string) {
        this.symbol = symbol;
        this.power = this.mapCardToPower();
    }

    getPower() {
        return this.power;
    }

    getSymbol() {
        return this.symbol;
    }

    isJoker() {
        return this.getSymbol() === JOKER_SYMBOL;
    }

    compare(card: Card) {
        return card.getPower() - this.getPower();
    }

    private mapCardToPower() {
        return CARD_POWERS[this.getSymbol()] ?? 0;
    }
}

class Hand implements IHand {
    private readonly cards: Card[];
    private readonly bid: number;
    private readonly type: HandType;
    private readonly power: number;

    constructor(cards: Card[], bid: number) {
        this.bid = bid;
        this.cards = cards;
        this.type = this.calculateType();
        this.power = this.calculatePower();
    }

    getBid() {
        return this.bid;
    }

    getType() {
        return this.type;
    }

    getTypePower() {
        switch (this.type) {
            case "five of a kind":
                return 100;

            case "four of a kind":
                return 90;

            case "full house":
                return 70;

            case "three of a kind":
                return 50;

            case "two pair":
                return 30;

            case "one pair":
                return 10;

            case "high card":
                return 1;
        }
    }

    getPower() {
        return this.power;
    }

    getCards() {
        return this.cards;
    }

    private calculateType(): HandType {
        const occurences = new Map<string, number>();
        let jokersCount = 0;

        this.cards.forEach((card) => {
            if (card.isJoker()) {
                jokersCount++;
            } else {
                const symbol = card.getSymbol();
                occurences.set(symbol, (occurences.get(symbol) ?? 0) + 1);
            }
        });

        const values = Array
            .from(occurences.values())
            .sort((a, b) => b - a);

        values[0] += jokersCount;

        switch (values.length) {
            case 1:
                return "five of a kind";

            case 2:
                if (values[0] === 4) {
                    return "four of a kind";
                } else {
                    return "full house";
                }

            case 3:
                if (values[0] === 3) {
                    return "three of a kind";
                } else {
                    return "two pair";
                }

            case 4:
                return "one pair";

            default:
                return "high card";
        }
    }

    private calculatePower(): number {
        return this.cards.reduce((power, card) => power + card.getPower(), 0);
    }

    compare(hand: Hand) {
        const typePowerDiff = hand.getTypePower() - this.getTypePower();

        if (typePowerDiff) {
            return typePowerDiff;
        }

        const otherHandCards = hand.getCards();
        const thisCards = this.getCards();

        for (let i = 0; i < this.getCards().length; i++) {
            const cardsPowerDiff = thisCards[i].compare(otherHandCards[i]);

            if (cardsPowerDiff) {
                return cardsPowerDiff;
            }
        }

        return 0;
    }
}

function mapInputLineToHand(line: string, withJokers?: boolean) {
    const [cardsString, bidString] = line.split(" ");
    const bid = parseInt(bidString);

    const cardSymbols = cardsString.split("");
    const cards = cardSymbols.map((symbol) => {
        if (withJokers && symbol === "J") {
           return new Card(JOKER_SYMBOL);
        } else {
           return new Card(symbol)
        }
    });

    return new Hand(cards, bid);
}

function run(options?: { withJokers?: boolean }) {
    const lines = FileReader.getLines(FILE_PATH);
    const hands = lines.map((line) => mapInputLineToHand(line, options?.withJokers));

    const sortedHands = [...hands].sort((a, b) => b.compare(a))

    let rank = 1;
    const result = sortedHands.reduce((sum, hand) => sum + hand.getBid() * rank++, 0);

    console.log(result);
}

run();
run({ withJokers: true })
