const { AttendancePolicy, ExtraPointsPolicy } = require('../model/Policies');

class GradeCalculator {
    static MAX_EVALUATIONS = 10;

    calculate(evaluations, hasReachedMinAttendance, allYearsTeachers) {
        if (evaluations.length > GradeCalculator.MAX_EVALUATIONS) {
            throw new Error(`Maximum number of evaluations is ${GradeCalculator.MAX_EVALUATIONS}`);
        }

        // 1. Weighted Average
        let weightedAverage = 0.0;
        if (evaluations.length > 0) {
            weightedAverage = evaluations.reduce((sum, e) => sum + e.getWeightedScore(), 0);
        }

        // 2. Penalty
        const penalty = AttendancePolicy.calculatePenalty(weightedAverage, hasReachedMinAttendance);

        // 3. Extra Points
        const extraPoints = ExtraPointsPolicy.calculateExtraPoints(allYearsTeachers);

        // 4. Final Calculation
        let finalScore = weightedAverage - penalty + extraPoints;

        // Cap at 20 and floor at 0
        finalScore = Math.max(0.0, Math.min(20.0, finalScore));

        return {
            weightedAverage: parseFloat(weightedAverage.toFixed(2)),
            penalty: parseFloat(penalty.toFixed(2)),
            extraPoints: parseFloat(extraPoints.toFixed(2)),
            finalScore: parseFloat(finalScore.toFixed(2)),
            details: {
                evaluationsCount: evaluations.length,
                attendanceMet: hasReachedMinAttendance,
                teachersConsensus: allYearsTeachers.length > 0 && allYearsTeachers.every(v => v === true)
            }
        };
    }
}

module.exports = GradeCalculator;
