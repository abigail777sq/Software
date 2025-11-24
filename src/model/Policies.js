class AttendancePolicy {
    static PENALTY_PERCENTAGE = 0.30; // 30% penalty

    static calculatePenalty(finalScore, hasReachedMin) {
        if (hasReachedMin) {
            return 0.0;
        }
        return finalScore * this.PENALTY_PERCENTAGE;
    }
}

class ExtraPointsPolicy {
    static EXTRA_POINT_VALUE = 1.0;

    static calculateExtraPoints(allYearsTeachers) {
        if (!allYearsTeachers || allYearsTeachers.length === 0) {
            return 0.0;
        }
        // Assumption: All must agree
        const allAgree = allYearsTeachers.every(v => v === true);
        return allAgree ? this.EXTRA_POINT_VALUE : 0.0;
    }
}

module.exports = { AttendancePolicy, ExtraPointsPolicy };
