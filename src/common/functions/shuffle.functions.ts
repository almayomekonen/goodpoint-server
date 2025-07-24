/*  Just a really simple shuffle so that the user won't be scared of his phone number appearing in the url
 *  Note: we have to pass something in the url to know who the user is , This is because
 *  the sms sent to the user will inlude a link to a site that does not posses any pre-info about the user , so it has
 *  to know something about it beforehand
 *
 *  TODO: maybe improve shuffle or switch to a different method of hiding the phone number
 *
 * */

export function shuffle(s: string) {
    const newPositions = process.env.phone_shuffle.split(',').map((numString) => Number(numString));
    for (let i = 0; i < 10; i++) {
        const tmp = s[i];
        const newPos = newPositions[i];
        s = s.slice(0, i) + s[newPos] + s.slice(i + 1, s.length);
        s = s.slice(0, newPos) + tmp + s.slice(newPos + 1, s.length);
    }
    return s;
}

export function deShuffle(s: string) {
    const newPositions = process.env.phone_shuffle.split(',').map((numString) => Number(numString));
    for (let i = 9; i >= 0; i--) {
        const tmp = s[i];
        const newPos = newPositions[i];
        s = s.slice(0, i) + s[newPos] + s.slice(i + 1, s.length);
        s = s.slice(0, newPos) + tmp + s.slice(newPos + 1, s.length);
    }
    return s;
}
