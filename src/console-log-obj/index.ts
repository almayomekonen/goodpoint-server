import { inspect } from 'util';

/**
 * will log @param obj to console using `inspect()` which will **fully log the object, even if it's deeply nested**
 * @param obj obj to log
 * @example ```ts
 * console.logDepth({ 1: { 2: { 3: { 4: { 5: { new: true } } } } } })
 * // you're welcome to compare with:
 * // console.log({ 1: { 2: { 3: { 4: { 5: { new: true } } } } } })
 * ```
 */
const logDepth = (...objs: any[]) => {
    console.log(
        ...objs.map((obj) => (!obj || typeof obj !== 'object' ? obj : inspect(obj, { depth: null, colors: true }))),
    );
};
console.logDepth = logDepth;
