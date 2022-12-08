import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAIKEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `Decide whether a query is searching for an item location (\`Location\`), or looking for general help (\`Help\`)

Query: how do i register for membership
Type: Help

Query: Where can i find flour?
Type: Location (flour)

Query: I need a fish
Type: Location (fish)

Query: potato
Type: Location (potato)

Query: 23j920fiaa
Type: Help

Query: Must I pay for platic bags?
Type: Help

Query: chocolate milk
Type: Location (chocolate milk)

Query: What time does Fairprice open
Type: Help

Query: `
/*
*/

async function predict(prompt) {
    const res = await openai.createCompletion({
        model: 'text-curie-001',
        prompt: PROMPT+prompt+'\nType: ',
        max_tokens: 10,
        logit_bias: {"628": -100, "128": -100}
    })
    const text = res.data.choices[0].text.trim()

    if (text.slice(0,4) == 'Help') {
        return [0, text]
    } else if (text.slice(0,8) == 'Location') {
        const end_ind = text.indexOf(')')
        return [1, text.slice(10, end_ind)]
    } else {
        return [-1, text]
    }
}

export default predict;

/*
const response = await openai.listEngines();

console.log(response.data)
*/
