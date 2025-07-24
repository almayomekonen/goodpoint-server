import { limitTextAtDelimiter } from '../limitTextAtDelimiter';
describe('limitTextAtDelimiter', () => {
    it('should limit text at the last occurrence of a specified delimiter when the maximum length is reached', () => {
        const inputText = 'This is an example text that needs to be limited at a certain length.';
        const maxLength = 30;
        const optionalDelimiters = [' ', '.'];
        const result = limitTextAtDelimiter(inputText, maxLength, optionalDelimiters);
        expect(result).toBe('This is an example text that...');
    });

    it('should return the full text if it is shorter than the maximum length', () => {
        const inputText = 'Short text.';
        const maxLength = 30;
        const result = limitTextAtDelimiter(inputText, maxLength);
        expect(result).toBe(inputText);
    });

    it('should return an empty string if the input text is empty', () => {
        const inputText = '';
        const maxLength = 30;
        const result = limitTextAtDelimiter(inputText, maxLength);
        expect(result).toBe('');
    });

    it('should remove extra whitespaces', () => {
        const inputText = 'This   is an   example text   with   extra spaces.';
        const maxLength = 30;
        const result = limitTextAtDelimiter(inputText, maxLength);
        expect(result).not.toContain('  '); // The result should not contain any double spaces
    });

    it('should cut off in the middle of a word if the maxLength is in the middle of a long word', () => {
        const inputText = 'This is an example text with a supercalifragilisticexpialidocious word.';
        const maxLength = 50;
        const result = limitTextAtDelimiter(inputText, maxLength);
        expect(result).toBe('This is an example text with a supercalifragilisti...');
    });

    it('should remove duplicate punctuation marks', () => {
        const inputText = 'This is an example!! text with duplicate!,, punctuation!! marks.';
        const maxLength = 50;
        const result = limitTextAtDelimiter(inputText, maxLength);
        expect(result).not.toContain('!!');
        expect(result).not.toContain(',,');
        expect(result).toBe('This is an example! text with duplicate!,...');
    });

    it('should handle the case when the last occurrence of the specified delimiter is before the maximum length', () => {
        const inputText = 'This is an example text with a delimiter.';
        const maxLength = 30;
        const optionalDelimiters = [' ', '.'];
        const result = limitTextAtDelimiter(inputText, maxLength, optionalDelimiters);
        expect(result).toBe('This is an example text with a...');
    });

    it('should handle null input gracefully', () => {
        const result = limitTextAtDelimiter(null, 30);
        expect(result).toBe('');
    });

    it('should handle undefined input gracefully', () => {
        const result = limitTextAtDelimiter(undefined, 30);
        expect(result).toBe('');
    });
});
