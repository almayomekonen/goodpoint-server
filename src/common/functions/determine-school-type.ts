import { SchoolGrades } from '../enums';
import { SchoolGradesType } from '../enums/school-type.enum';

/**
 *
 * @param minGrade
 * @param maxGrade
 * @returns the school type - elementary, middle, high , etc...
 */
export function determineSchoolType(minGrade: SchoolGrades, maxGrade: SchoolGrades): SchoolGradesType {
    //based on the range of the grades , determine the school type
    if (minGrade <= SchoolGrades.SIXTH) {
        if (maxGrade <= SchoolGrades.SIXTH) return SchoolGradesType.ELEMENTARY;
        if (maxGrade <= SchoolGrades.EIGHTH) return SchoolGradesType.ELEMENTARY_AND_MIDDLE;
        //else maxGrade is greater than 8th grade
        return SchoolGradesType.ELEMENTARY_AND_HIGH;
    }

    if (minGrade <= SchoolGrades.EIGHTH) {
        if (maxGrade <= SchoolGrades.EIGHTH) return SchoolGradesType.MIDDLE;
        //else maxGrade is greater than 8th grade
        return SchoolGradesType.HIGH_MIDDLE;
    }

    //else minGrade is greater than 8th grade
    return SchoolGradesType.HIGH;
}
