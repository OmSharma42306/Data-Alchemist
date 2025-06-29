// app/api/ai-task-search/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Together } from "together-ai"
import { system_prompt_tasks } from "@/lib/prompts/system_prompt_tasks"

const together = new Together({ apiKey: process.env.GPT4_API_KEY! })

export async function POST(req: NextRequest) {
  const { query, tasks } = await req.json()

  try {
    const res = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: system_prompt_tasks },
        { role: "user", content: `User Query: "${query}"\nTasks: ${JSON.stringify(tasks)}` },
      ],
    })

    const content = res.choices?.[0]?.message?.content || ""
    const cleaned = content.replace(/```json|```/g, "")
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err: any) {
    return NextResponse.json({ taskIds: [], error: err.message }, { status: 500 })
  }
}
