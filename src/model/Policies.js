/**
 * Policy for handling attendance penalties.
 * @class
 */
class AttendancePolicy {
    static PENALTY_PERCENTAGE = 0.30; // 30% penalty

    /**
     * Calculates the penalty for not meeting minimum attendance.
     * @param {number} finalScore - The calculated final score before penalties
     * @param {boolean} hasReachedMin - Whether minimum attendance was met
     * @returns {number} The penalty amount (0 if attendance met, otherwise 30% of score)
     */
    static calculatePenalty(finalScore, hasReachedMin) {
        if (hasReachedMin) {
            return 0;
        }
        return finalScore * this.PENALTY_PERCENTAGE;
    }
}

/**
 * Policy for handling extra points based on teacher consensus.
 * @class
 */
class ExtraPointsPolicy {
    static EXTRA_POINT_VALUE = 1.0;

    /**
     * Calculates extra points based on teacher agreement.
     * @param {boolean[]} allYearsTeachers - Array of teacher agreement votes
     * @returns {number} Extra points (1 if all agree, 0 otherwise)
     */
    static calculateExtraPoints(allYearsTeachers) {
        if (!allYearsTeachers || allYearsTeachers.length === 0) {
            return 0;
        }
        // Assumption: All must agree
        const allAgree = allYearsTeachers.every(v => v === true);
        return allAgree ? this.EXTRA_POINT_VALUE : 0;
    }
}

module.exports = { AttendancePolicy, ExtraPointsPolicy };
