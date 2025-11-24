const { test, describe, it } = require('node:test');
const assert = require('node:assert');
const Evaluation = require('../src/model/Evaluation');
const GradeCalculator = require('../src/service/GradeCalculator');
const { AttendancePolicy, ExtraPointsPolicy } = require('../src/model/Policies');

describe('GradeCalculator', () => {
    const calculator = new GradeCalculator();

    it('should calculate normal case correctly', () => {
        // 2 exams, 50% each, score 15 and 17. Avg = 16.
        const evaluations = [
            new Evaluation(15, 50),
            new Evaluation(17, 50)
        ];
        const result = calculator.calculate(evaluations, true, []);
        assert.strictEqual(result.finalScore, 16.0);
        assert.strictEqual(result.penalty, 0.0);
    });

    it('should apply penalty when attendance is not met', () => {
        // Avg 20, but no attendance. Penalty 30% -> 6 points. Final 14.
        const evaluations = [new Evaluation(20, 100)];
        const result = calculator.calculate(evaluations, false, []);
        const expectedPenalty = 20 * AttendancePolicy.PENALTY_PERCENTAGE;
        assert.strictEqual(result.penalty, expectedPenalty);
        assert.strictEqual(result.finalScore, 20 - expectedPenalty);
    });

    it('should add extra points when all teachers agree', () => {
        // Avg 15. All teachers agree -> +1. Final 16.
        const evaluations = [new Evaluation(15, 100)];
        const teachersAgreement = [true, true, true];
        const result = calculator.calculate(evaluations, true, teachersAgreement);
        assert.strictEqual(result.extraPoints, ExtraPointsPolicy.EXTRA_POINT_VALUE);
        assert.strictEqual(result.finalScore, 16.0);
    });

    it('should not add extra points without consensus', () => {
        // Avg 15. Mixed agreement -> +0. Final 15.
        const evaluations = [new Evaluation(15, 100)];
        const teachersAgreement = [true, false, true];
        const result = calculator.calculate(evaluations, true, teachersAgreement);
        assert.strictEqual(result.extraPoints, 0.0);
        assert.strictEqual(result.finalScore, 15.0);
    });

    it('should throw error if max evaluations exceeded', () => {
        const evaluations = [];
        for (let i = 0; i < 11; i++) {
            evaluations.push(new Evaluation(10, 10));
        }
        assert.throws(() => {
            calculator.calculate(evaluations, true, []);
        }, /Maximum number of evaluations/);
    });

    it('should cap score at 20', () => {
        // Avg 20 + 1 extra point = 21 -> Should be 20.
        const evaluations = [new Evaluation(20, 100)];
        const teachersAgreement = [true];
        const result = calculator.calculate(evaluations, true, teachersAgreement);
        assert.strictEqual(result.finalScore, 20.0);
    });

    it('should floor score at 0', () => {
        const evaluations = [new Evaluation(0, 100)];
        const result = calculator.calculate(evaluations, false, []);
        assert.strictEqual(result.finalScore, 0.0);
    });
});
