export class MathHelpers {
    static greatestCommonDenominator(a: number, b: number) {
        return a ? MathHelpers.greatestCommonDenominator(b % a, a) : b;
    };

    static lowestCommonMultiplier(a: number, b: number) {
        return a * b / MathHelpers.greatestCommonDenominator(a, b);
    };
}
