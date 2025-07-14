/**
 *
 * Creates search string for fuzzy search (using `MATCH` and `AGAINST` with fullText index.)
 */
export function createSearchString(str: string) {
    return (
        str
            .split('-')
            .join(' *')
            .split(' ')
            .map((str) => `+${str}`)
            .join(' *') + '*'
    );
}
