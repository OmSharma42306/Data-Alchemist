import { Together } from "together-ai"
import { system_prompt } from "@/lib/prompts/system_prompt"

const together = new Together({ apiKey: process.env.GPT4_API_KEY! })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = body.prompt

    const response = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: system_prompt || "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    })

    const content = response.choices?.[0]?.message?.content || ""

    return new Response(JSON.stringify({ result: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("AI API error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}



