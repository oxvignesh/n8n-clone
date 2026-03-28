import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { Inngest } from "inngest"

// create a client to send and receive events
export const inngest = new Inngest({ id: "n8n-clone" })

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

//inngest functions
const executeAI = inngest.createFunction(
  { id: "execute-ai", triggers: [{ event: "execute/ai" }] },
  async ({ step }) => {
    const { steps: openaiSteps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-4.1-mini"),
      system: "You are a helpful assistant.",
      prompt: "what is 2+2?",
    })

    const { steps: anthropicSteps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic("claude-haiku-4-5"),
      system: "You are a helpful assistant.",
      prompt: "what is 2+2?",
    })

    const { steps: geminiSteps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant.",
      prompt: "what is 2+2?",
    })
    return {
      openaiSteps,
      anthropicSteps,
      geminiSteps
    }
  }
)

// add the function to the exported array:
export const functions = [executeAI]
