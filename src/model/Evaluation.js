class Evaluation {
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

    getWeightedScore() {
        return this.score * (this.weight / 100.0);
    }
}

module.exports = Evaluation;
