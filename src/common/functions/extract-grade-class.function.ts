import { GRADES_REGEX } from '../consts/regexes';
import { translateGrade } from './hebrew-excel-translations';

/**
 *
 * @param str - raw grade (with or without classIndex) string
 * @returns grade and classIndex as numbers.
 */
export function extractGradeAndClass(str: string) {
    try {
        const grade = translateGrade(str?.match(GRADES_REGEX)?.join('') || '');
        const classIndex = Number(str.match(/\d+/)?.join(''));

        return { grade, classIndex };
    } catch (err) {
        return { grade: null, classIndex: 0 };
    }
}
