import { Configuration, OpenAIApi } from 'openai';
/** 
 *function that uses chat-gpt api to split a name into first and last name
    the function also returns the number of tokens used, to be used for billing each school for the api usage
    ,the gptTokens will be added to a column in the school entity in the database
 * @param name the name to split
 * @returns a promise that resolves to an object with the first and last name, and the number of tokens used, or an object with the first and last name and a boolean indicating if the api was used
 */
export function splitName(
    name: string,
):
    | Promise<{ firstName: string; lastName: string; tokensUsed: number; didUseGpt: true }>
    | { firstName: string; lastName: string; didUseGpt: false } {
    // remove any extra spaces
    name = name.trim();
    //remove any extra spaces in the middle of the name
    name = name.replace(/\s+/g, ' ');
    //checking if there is a need to split , meaning there is at least three words, or if the environment is not production
    const nameArr = name.split(' ');
    if (nameArr.length < 3 || process.env.NODE_ENV != 'production') {
        return {
            firstName: nameArr[0] ?? '',
            //if there is no last name, return an empty string
            lastName: nameArr[1] ?? '',
            didUseGpt: false,
        };
    }

    //getting the api key from the environment variables
    const key = process.env.CHAT_GPT_KEY;

    const openai = new OpenAIApi(new Configuration({ apiKey: key }));
    return openai
        .createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `split ${name} first last json` }],
        })
        .then((res) => {
            //parsing the json from the api response

            const result = JSON.parse(res.data.choices[0].message.content);
            return {
                firstName: result.firstName,
                lastName: result.lastName,
                tokensUsed: res.data.usage.total_tokens,
                didUseGpt: true as const,
            };
        })
        .catch((err) => {
            throw err;
        });
}
