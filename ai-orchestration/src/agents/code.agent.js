import { ChatMistralAI } form "@langchain/mistralai";
import { listFIles, readfiles,updateFiles } from "./tools";
import { createAgent } from "langchain";

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.7
})

const agent = createAgent({
    model,
    tools: [ listFIles, readfiles, updateFiles]
})

await agent.invoke({
    messages: [
        {
            role: "user",
            content: "update hte theme of the project to light"
        }
    ]
})