/**
 * Represents a single evaluation with a score and weight.
 * @class
 */
class Evaluation {
    /**
     * Creates an Evaluation instance.
     * @param {number} score - The score obtained (must be between 0 and 20)
     * @param {number} weight - The weight percentage (must be between 0 and 100)
     * @throws {Error} If score is not between 0 and 20
     * @throws {Error} If weight is not between 0 and 100
     */
    constructor(score, weight) {
        if (score < 0 || score > 20) {
            throw new Error("Score must be between 0 and 20");
        }
        if (weight <= 0 || weight > 100) {
            throw new Error("Weight must be between 0 and 100");
        }
        this.score = score;
        this.weight = weight;
    }

    /**
     * Calculates the weighted score.
     * @returns {number} The score multiplied by the weight percentage
     */
    getWeightedScore() {
        return this.score * (this.weight / 100.0);
    }
}

module.exports = Evaluation;
