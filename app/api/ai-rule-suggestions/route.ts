import { NextRequest, NextResponse } from "next/server"
import { Together } from "together-ai"
import { ai_rule_suggestion_prompt } from "@/lib/prompts/ai_rule_suggestion_prompt"

const together = new Together({ apiKey: process.env.GPT4_API_KEY! })

export async function POST(req: NextRequest) {
  const { tasks, workers } = await req.json()

  const taskTitles = tasks.map((t:any) => `- ${t.title} (ID: ${t.taskId})`).join("\n")
  const workerSkills = workers.map((w:any) => `- ${w.name || w.workerId}: ${w.skills}`).join("\n")

  const prompt = `Here are the tasks:\n${taskTitles}\n\nHere are the workers and their skills:\n${workerSkills}\n\nSuggest 2-3 useful rules.`

  try {
    const response = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: ai_rule_suggestion_prompt },
        { role: "user", content: prompt },
      ],
    })

    const content = response.choices?.[0]?.message?.content ?? ""

    // Strip markdown if any
    const cleaned = content.replace(/```json|```/g, "").trim()

    const parsed = JSON.parse(cleaned)
    return NextResponse.json({ rules: parsed })
  } catch (err: any) {
    console.error("AI rule suggestion error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
