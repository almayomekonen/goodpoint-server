import * as yup from 'yup';

declare module 'yup' {
    interface StringSchema extends yup.Schema {
        /**
         * Validates the field using a comfortable phone validation string template.
         *
         * @param template a string template to validate the field against. Usually similar to `"05#-###-###"`.
         * @param options options for the validation template:
         *   - `startCodes`: an array of strings that the number can start with, which replace `"!"` in the template.
         *   - `optionalDashes`: whether `"-"` should be treated as optional. Defaults to `true`.
         *   - `spaceAsDash`: whether `" "` should be treated as if it were `"-"`. Can be a boolean or `"exclusive"`, which means that either ALL or NONE of the `"-"`s in the field should be `" "`
         *
         * @example
         * const schema1 = yup.string().phone("05#-###-####");
         * schema1.isValid("050-555-5555"); // `true`
         * schema1.isValid("050555-5555"); // `true`
         * schema1.isValid("0505555555"); // `true`
         * schema1.isValid("235-555-5"); // `false`
         *
         * const schema2 = yup.string().phone("(!|0)5#-###-####", { startCodes: ["972"] });
         * schema2.isValid("050-555-5555"); // `true`
         * schema2.isValid("+972-50-555-5555"); // `true`
         * schema2.isValid("(+972)-50-555-5555"); // `true`
         * schema2.isValid("972-50-555-5555"); // `true`
         *
         * const schema3 = yup.string().phone("05#-###-####", { optionalDashes: false });
         * schema3.isValid("050-555-5555"); // `true`
         * schema3.isValid("050555-5555"); // `false`
         * schema3.isValid("0505555555"); // `false`
         *
         * const schema4 = yup.string().phone("05#-###-####", { spaceAsDash: true });
         * schema4.isValid("050 555 5555"); // `true`
         * schema4.isValid("050 555-5555"); // `true`
         * schema4.isValid("050 5555555"); // `true`
         *
         * const schema5 = yup.string().phone("05#-###-####", { spaceAsDash: "exclusive" });
         * schema5.isValid("050 555 5555"); // `true`
         * schema5.isValid("050 555-5555"); // `false`
         **/
        phone(
            template: string,
            options?: PhoneTemplateOptions,
            message?: string | ((params: yup.TestContext) => string),
        ): this;
    }
}

/**
 * Configures `yup` by adding extra methods to several schemas.
 *
 * The methods added are:
 * - `yup.StringSchema.confirm(path: string)`: ensures that the string will be the same as `path`. Useful for password confirmation.
 * - `yup.StringSchema.phone(regions?: CountryCode | CountryCode[], message?: string)`: validates the field as a phone number (from `regions`, if specified)
 * - `yup.ObjectSchema.initialize()`: returns an `initialValues` object from a yup schema, using the options passed to `yupConfig`.
 *
 * See more on `yupConfig.methods` [here](https://hilma.atlassian.net/wiki/spaces/TD/pages/658702565/yupConfig.methods).
 **/
export function methodConfig() {
    if (!yup.StringSchema.prototype.phone) {
        yup.StringSchema.prototype.phone = function phone(
            template: string,
            options?: PhoneTemplateOptions,
            message?: string | ((params: yup.TestContext) => string),
        ) {
            const tester = templateToRegex(template, options);
            return this.test('phone', (value, context) => {
                if (!value) return true;

                value = String(value); // make sure numbers becomes strings
                if (value[0] === '5') value = '0' + value;

                if (!tester.test(value)) {
                    return context.createError({
                        message: message
                            ? typeof message === 'string'
                                ? message
                                : message(context)
                            : `errors.phone|fields.${context.path}|${template}`,
                    });
                }

                return true;
            });
        };
    }
}
export function localeConfig() {
    yup.setLocale({
        mixed: {
            required: ({ path }) => `${path} required`,
        },
        // string: {
        //     min: ({ path, min }) => `errors.min|fields.${path}|${min}`,
        //     max: ({ path, max }) => `errors.max|fields.${path}|${max}`,
        //     email: ({ path }) => `errors.email|fields.${path}|`,
        //     url: ({ path }) => `errors.url|fields.${path}|`,
        //     length: ({ path, length }) => `errors.length|fields.${path}|${length}`,
        //     trim: ({ path }) => `errors.trim|fields.${path}|`,
        // },
        // number: {
        //     min: ({ path, min }) => `errors.min|fields.${path}|${min}`,
        //     max: ({ path, max }) => `errors.max|fields.${path}|${max}`,
        //     lessThan: ({ path, less }) => `errors.lessThan|fields.${path}|${less}`,
        //     moreThan: ({ path, more }) => `errors.moreThan|fields.${path}|${more}`,
        //     positive: ({ path }) => `errors.positive|fields.${path}|`,
        //     negative: ({ path }) => `errors.negative|fields.${path}|`,
        //     integer: ({ path }) => `errors.integer|fields.${path}|`,
        // },
        // date: {
        //     max: ({ path, max }) =>
        //         `errors.maxDate|fields.${path}|${max.toLocaleString(
        //             finalOptions.dateLocale,
        //             finalOptions.dateLocaleOptions,
        //         )}`,
        //     min: ({ path, min }) =>
        //         `errors.minDate|fields.${path}|${min.toLocaleString(
        //             finalOptions.dateLocale,
        //             finalOptions.dateLocaleOptions,
        //         )}`,
        // },
    });
}

export type PhoneTemplateOptions = {
    /**
     * An array of strings that the phone number can begin with. Will replace `"!"` in the template.
     *
     * @default
     * []
     **/
    startCodes?: string[];
    /**
     * Whether dashes (`"-"`) should be optional.
     *
     * @default
     * true
     **/
    optionalDashes?: boolean;
    /**
     * Whether spaces (`" "`) should be treated as though they were dashes (`"-"`).
     * Can be a boolean value, or `"exclusive"`, denoting that the phone number should either have all dashes or all spaces.
     *
     * @default
     * false
     **/
    spaceAsDash?: boolean | 'exclusive';
};

export function templateToRegex(template: string, options: PhoneTemplateOptions = {}) {
    const { startCodes = [], optionalDashes = true, spaceAsDash = false } = options;

    let codeString = `\\+?${startCodes.join('|')}`;
    codeString = `(?:\\(${codeString}\\)|${codeString})-`;

    let finalTemplate = template.replaceAll('#', '\\d');
    finalTemplate = finalTemplate.replaceAll('+', '\\+');
    finalTemplate = finalTemplate.replaceAll('!', codeString);

    if (optionalDashes) finalTemplate = finalTemplate.replaceAll('-', '-?');

    if (spaceAsDash) {
        if (spaceAsDash === 'exclusive') finalTemplate = `${finalTemplate}|${finalTemplate.replaceAll('-', ' ')}`;
        else finalTemplate = finalTemplate.replaceAll('-', '[- ]');
    }

    return new RegExp(finalTemplate);
}
