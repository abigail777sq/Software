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

    it('should handle empty evaluations array', () => {
        const evaluations = [];
        const result = calculator.calculate(evaluations, true, []);
        assert.strictEqual(result.finalScore, 0.0);
        assert.strictEqual(result.weightedAverage, 0.0);
    });

    it('should handle weights that do not sum to 100', () => {
        const evaluations = [
            new Evaluation(20, 30),
            new Evaluation(15, 40)
        ];
        const result = calculator.calculate(evaluations, true, []);
        // 20*0.3 + 15*0.4 = 6 + 6 = 12
        assert.strictEqual(result.weightedAverage, 12.0);
    });

    it('should validate evaluation score boundaries', () => {
        assert.throws(() => {
            new Evaluation(-1, 50);
        }, /Score must be between 0 and 20/);

        assert.throws(() => {
            new Evaluation(21, 50);
        }, /Score must be between 0 and 20/);
    });

    it('should validate evaluation weight boundaries', () => {
        assert.throws(() => {
            new Evaluation(15, 0);
        }, /Weight must be between 0 and 100/);

        assert.throws(() => {
            new Evaluation(15, 101);
        }, /Weight must be between 0 and 100/);
    });

    it('should handle single teacher agreement', () => {
        const evaluations = [new Evaluation(10, 100)];
        const result = calculator.calculate(evaluations, true, [true]);
        assert.strictEqual(result.extraPoints, 1.0);
        assert.strictEqual(result.finalScore, 11.0);
    });

    it('should handle all teachers disagreeing', () => {
        const evaluations = [new Evaluation(10, 100)];
        const result = calculator.calculate(evaluations, true, [false, false]);
        assert.strictEqual(result.extraPoints, 0.0);
    });

    it('should calculate correctly with multiple evaluations', () => {
        const evaluations = [
            new Evaluation(18, 30),
            new Evaluation(16, 30),
            new Evaluation(14, 40)
        ];
        // 18*0.3 + 16*0.3 + 14*0.4 = 5.4 + 4.8 + 5.6 = 15.8
        const result = calculator.calculate(evaluations, true, []);
        assert.strictEqual(result.weightedAverage, 15.8);
        assert.strictEqual(result.finalScore, 15.8);
    });

    it('should apply both penalty and extra points correctly', () => {
        const evaluations = [new Evaluation(20, 100)];
        // 20 - 6 (penalty) + 1 (extra) = 15
        const result = calculator.calculate(evaluations, false, [true, true]);
        assert.strictEqual(result.penalty, 6.0);
        assert.strictEqual(result.extraPoints, 1.0);
        assert.strictEqual(result.finalScore, 15.0);
    });

    it('should return correct details object', () => {
        const evaluations = [new Evaluation(15, 100)];
        const result = calculator.calculate(evaluations, true, [true, true]);
        assert.strictEqual(result.details.evaluationsCount, 1);
        assert.strictEqual(result.details.attendanceMet, true);
        assert.strictEqual(result.details.teachersConsensus, true);
    });
});
