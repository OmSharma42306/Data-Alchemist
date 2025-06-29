"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRecoilState, useRecoilValue } from "recoil"
import { dataState, rulesState } from "@/lib/recoil/atoms"
import { v4 as uuidv4 } from "uuid"

export default function NaturalLanguageInput() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any[]>([])
  const [rules, setRules] = useRecoilState(rulesState)
  const data = useRecoilValue(dataState)

  const handleSearch = () => {
    const filtered = data.tasks.filter((task) => {
      const phaseMatch = query.includes("phase 2") && task.preferredPhases?.toString().includes("2")
      const skillMatch = query.includes("SkillA") && task.requiredSkills?.includes("SkillA")
      return phaseMatch || skillMatch
    })
    setResult(filtered)
  }

  const handleRuleConvert = () => {
    if (query.toLowerCase().includes("must run together")) {
      const taskNames = query.match(/\b\w+/g) || []
      const t1 = data.tasks.find((t) => query.includes(t.title))
      const t2 = data.tasks.find((t) => t !== t1 && query.includes(t.title))

      if (t1 && t2) {
        const newRule = {
          id: uuidv4(),
          type: "co-run",
          name: `${t1.title} + ${t2.title} must run together`,
          description: `Ensure ${t1.title} and ${t2.title} are co-scheduled`,
          conditions: {
            task1: t1.taskId,
            task2: t2.taskId,
          },
          actions: {},
        }
        setRules((prev) => [...prev, newRule])
        alert("Rule created successfully ✨")
      } else {
        alert("Could not find matching task names")
      }
    } else {
      alert("Currently only 'must run together' rules are supported")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Natural Language Assistant</h3>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask: Show tasks in phase 2 with SkillA or Add rule: Design and QA must run together"
      />
      <div className="flex gap-2">
        <Button onClick={handleSearch}>Search Tasks</Button>
        <Button onClick={handleRuleConvert} variant="secondary">
          Convert to Rule
        </Button>
      </div>
      {result.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="mt-4 font-medium">Filtered Tasks:</p>
          <ul className="list-disc list-inside">
            {result.map((task, i) => (
              <li key={i}>{task.title} (ID: {task.taskId})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
