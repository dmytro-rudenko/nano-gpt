// import {fileURLToPath} from "url";
import path from "path";
import os from "os";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
    const model = new LlamaModel({
        modelPath: path.join(os.homedir(), ".cache/gpt4all", "'mistral-7b-openorca.gguf2.Q4_0.gguf")
    });
    const context = new LlamaContext({model});
    const session = new LlamaChatSession({context});
    
    
    const q1 = "Hi there, how are you?";
    console.log("User: " + q1);
    
    const a1 = await session.prompt(q1);
    console.log("AI: " + a1);
    
    
    const q2 = "Summerize what you said";
    console.log("User: " + q2);
    
    const a2 = await session.prompt(q2);
    console.log("AI: " + a2);
}

main()