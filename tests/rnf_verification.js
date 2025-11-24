const { test, describe, it } = require('node:test');
const assert = require('node:assert');
const GradeCalculator = require('../src/service/GradeCalculator');
const Evaluation = require('../src/model/Evaluation');

describe('Non-Functional Requirements Verification', () => {
    const calculator = new GradeCalculator();

    // RNF01 is already covered in functional tests (max 10 evaluations check)

    it('RNF02: Should support 50 concurrent calculation requests', async () => {
        const CONCURRENT_USERS = 50;
        const promises = [];

        const evaluations = [
            new Evaluation(18, 50),
            new Evaluation(16, 50)
        ];
        const hasAttendance = true;
        const teachersAgreement = [true, true];

        const start = performance.now();

        for (let i = 0; i < CONCURRENT_USERS; i++) {
            promises.push(new Promise((resolve) => {
                // Simulate a request
                const result = calculator.calculate(evaluations, hasAttendance, teachersAgreement);
                resolve(result);
            }));
        }

        const results = await Promise.all(promises);
        const end = performance.now();

        assert.strictEqual(results.length, CONCURRENT_USERS);
        results.forEach(res => {
            assert.strictEqual(res.finalScore, 18.0); // (18*0.5 + 16*0.5) + 1 = 17 + 1 = 18
        });

        console.log(`    RNF02: Processed ${CONCURRENT_USERS} concurrent requests in ${(end - start).toFixed(4)}ms`);
    });

    it('RNF03: Calculation must be deterministic', () => {
        const evaluations = [
            new Evaluation(15, 40),
            new Evaluation(20, 60)
        ];
        // Weighted: 6 + 12 = 18. 
        // No attendance: -30% of 18 = 5.4. -> 12.6
        // Extra points: No.

        const firstResult = calculator.calculate(evaluations, false, []);

        for (let i = 0; i < 1000; i++) {
            const loopResult = calculator.calculate(evaluations, false, []);
            assert.deepStrictEqual(loopResult, firstResult, `Non-deterministic result at iteration ${i}`);
        }
        console.log('    RNF03: 1000 iterations produced identical results.');
    });

    it('RNF04: Calculation time must be < 300 ms', () => {
        const evaluations = [];
        for (let i = 0; i < 10; i++) {
            evaluations.push(new Evaluation(15, 10));
        }

        const start = performance.now();
        calculator.calculate(evaluations, true, [true, true]);
        const end = performance.now();

        const duration = end - start;
        console.log(`    RNF04: Execution time was ${duration.toFixed(4)}ms`);

        assert.ok(duration < 300, `Calculation took too long: ${duration}ms`);
    });
});
