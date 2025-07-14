/**
 * Limits the text length by truncating it at the last occurrence of a specified delimiter
 * within the given maximum length. Appends an ellipsis if the text is truncated.
 *
 * @param {string} text - The input text to be limited.
 * @param {number} maxLength - The maximum length of the resulting text.
 * @param {string[]} delimiters - An array of delimiters to consider for truncation (default: [' ', ',', '.', '\n']).
 * @returns {string} - The truncated text with an optional ellipsis.
 * @example
 * const inputText = "This is an example text that needs to be limited at a certain length.";
 * const maxLength = 30;
 * const optionalDelimiters = [" ", "."];
 * const result = limitTextAtDelimiter(inputText, maxLength);
 * const result2 = limitTextAtDelimiter(inputText, maxLength, optionalDelimiters);
 * console.log(result); // Output: "This is an example text..."
 *
 */
export const limitTextAtDelimiter = (rawText: string, maxLength: number, delimiters = [' ', ',', '.', '!', '\n']) => {
    if (!rawText) return '';
    const cleanText = rawText.replace(/(?<=(\s|\.|,|!))\1+/g, '').trim();
    const ellipsis = cleanText.length > maxLength ? '...' : '';
    const preIndex = delimiters.reduce((acc, val) => Math.max(acc, cleanText.lastIndexOf(val, maxLength)), 0);
    const postIndex = delimiters.reduce(
        (acc, val) =>
            cleanText.indexOf(val, preIndex + 1) === -1 ? acc : Math.min(cleanText.indexOf(val, preIndex + 1), acc),
        cleanText.length,
    );
    const end = preIndex / maxLength > 0.7 ? preIndex : postIndex / maxLength < 1.3 ? postIndex : maxLength;
    return cleanText.slice(0, end) + ellipsis;
};
