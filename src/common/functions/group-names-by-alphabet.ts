/**
 * This function groups an array of objects by the first letter of a property
 *
 *
 * @param arr  the array of objects to group
 * @returns  an object with the first letter of the property as the key and the array of objects as the value
 *
 */

export const groupNamesByAlphabet = (
    arr: { firstName: string; lastName: string }[],
): { [key: string]: { firstName: string; lastName: string } } => {
    //create objects for each letter

    const res = {};
    let i = 0;
    while (i < arr.length) {
        const letter = arr[i].firstName[0]; //the letter for a new object
        //now we figure out where to stop
        res[letter] = [];
        while (i < arr.length && arr[i].firstName[0] === letter) {
            res[letter].push(arr[i]);
            i++;
        }
    }
    return res;
};
