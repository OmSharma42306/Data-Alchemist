"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRecoilState, useRecoilValue } from "recoil"
import { dataState, rulesState } from "@/lib/recoil/atoms"
import { v4 as uuidv4 } from "uuid"
import { useEffect } from "react"

export default function NaturalLanguageInput({pageType}:any) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any[]>([])
  const [rules, setRules] = useRecoilState(rulesState)
  const [placeholders,setPlaceHolders] = useState("");
  const data = useRecoilValue(dataState)
  
  useEffect(() => {
  if (pageType === "rules") {
    setPlaceHolders("Add rule: Design and QA must run together");
  } else {
    setPlaceHolders("Ask: Show tasks in phase 2 with SkillA");
  }
}, [pageType]);

  const handleSearch = () => {
    const filtered = data.tasks.filter((task) => {
      const phaseMatch = query.includes("phase 2") && task.preferredPhases?.toString().includes("2")
      const skillMatch = query.includes("SkillA") && task.requiredSkills?.includes("SkillA")
      return phaseMatch || skillMatch
    })
    setResult(filtered)
  }

  // const handleRuleConvert = () => {
  //   if (query.toLowerCase().includes("must run together")) {
  //     const taskNames = query.match(/\b\w+/g) || []
  //     const t1 = data.tasks.find((t) => query.includes(t.title))
  //     const t2 = data.tasks.find((t) => t !== t1 && query.includes(t.title))

  //     if (t1 && t2) {
  //       const newRule = {
  //         id: uuidv4(),
  //         type: "co-run",
  //         name: `${t1.title} + ${t2.title} must run together`,
  //         description: `Ensure ${t1.title} and ${t2.title} are co-scheduled`,
  //         conditions: {
  //           task1: t1.taskId,
  //           task2: t2.taskId,
  //         },
  //         actions: {},
  //       }
  //       setRules((prev) => [...prev, newRule])
  //       alert("Rule created successfully ✨")
  //     } else {
  //       alert("Could not find matching task names")
  //     }
  //   } else {
  //     alert("Currently only 'must run together' rules are supported")
  //   }
//   // }
//   const handleRuleConvert = async () => {
//   const res = await fetch("/api/ai-rule-converter", {
//     method: "POST",
//     body: JSON.stringify({ prompt: query }),
//     headers: { "Content-Type": "application/json" },
//   });

//   const data = await res.json();
  
//   if (data.result && data.result.type) {
//     setRules((prev) => [...prev, { id: uuidv4(), ...data.result }]);
//     alert("AI Rule created successfully ✨");
//   } else {
//     alert("Could not parse rule from your input.");
//   }
// };

const handleRuleConvert = async () => {
  const res = await fetch("/api/ai-rule-converter", {
    method: "POST",
    body: JSON.stringify({ prompt: query }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  try {
    const parsedRule = JSON.parse(data.result.trim());

    if (parsedRule && parsedRule.type) {
      setRules((prev) => [...prev, { id: uuidv4(), ...parsedRule }]);
      alert("AI Rule created successfully ✨");
    } else {
      alert("AI response didn't match rule format.");
    }
  } catch (err) {
    alert("Could not parse rule from your input.");
  }

  


};

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Natural Language Assistant</h3>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholders}
      />
      <div className="flex gap-2">
        {
          pageType === "rules"? <Button onClick={handleRuleConvert} >
          Convert to Rule
        </Button>
        : <Button onClick={handleSearch}>Search Tasks</Button>
        }
        {/* <Button onClick={handleSearch}>Search Tasks</Button> */}
        
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
