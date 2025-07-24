import { deShuffle, shuffle } from './shuffle.functions';

describe('testing shuffle function', () => {
    it('should shuffle and deShuffle the phone number', () => {
        const phoneNumber = '0502514251';
        const shuffled = shuffle(phoneNumber);
        const deShuffled = deShuffle(shuffled);
        expect(phoneNumber).toBe(deShuffled);
    });

    it('should fail to deshuffle the phone number', () => {
        const phoneNumber = '0502514251';
        const shuffled = shuffle(phoneNumber);
        const deShuffled = deShuffle(shuffled.replace('1', '3'));
        expect(phoneNumber).not.toBe(deShuffled);
    });
});
