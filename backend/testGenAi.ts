import {GoogleGenAI} from "@google/genai";
import Gemini from "./src/internals/adapters/llm";
import AppSecrets from "./src/packages/secret";
import * as readline from 'readline';

const secrets = new AppSecrets()
const genAI = new GoogleGenAI({apiKey: secrets.geminiConfiguration.apiKey});
const llmRepo = new Gemini(genAI, secrets);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

(async () => {
    const uri = await question('Enter URI: ');
    const mimeType = await question('Enter MIME type: ');

    let response = await llmRepo.getText([{
        uploadedData: {
            uri: uri.trim(),
            mimeType: mimeType.trim()
        }
    }])
    let fileStatus = await llmRepo.getFile(uri)
    console.log({response: response.response, fileStatus})
    rl.close();
})();