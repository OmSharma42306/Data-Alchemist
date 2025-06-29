// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useRecoilState, useRecoilValue } from "recoil"
// import { dataState, rulesState } from "@/lib/recoil/atoms"
// import { v4 as uuidv4 } from "uuid"
// import { useEffect } from "react"

// export default function NaturalLanguageInput({pageType}:any) {
//   const [query, setQuery] = useState("")
//   const [result, setResult] = useState<any[]>([])
//   const [rules, setRules] = useRecoilState(rulesState)
//   const [placeholders,setPlaceHolders] = useState("");
//   const data = useRecoilValue(dataState)
//   const [loading, setLoading] = useState(false)

  
//   useEffect(() => {
//   if (pageType === "rules") {
//     setPlaceHolders("Add rule: Design and QA must run together");
//   } else {
//     setPlaceHolders("Ask: Show tasks in phase 2 with SkillA");
//   }
// }, [pageType]);

//   // const handleSearch = () => {
//   //   const filtered = data.tasks.filter((task) => {
//   //     const phaseMatch = query.includes("phase 2") && task.preferredPhases?.toString().includes("2")
//   //     const skillMatch = query.includes("SkillA") && task.requiredSkills?.includes("SkillA")
//   //     return phaseMatch || skillMatch
//   //   })
//   //   setResult(filtered)
//   // }

// //   const handleSearch = async () => {
// //   const res = await fetch("/api/ai-task-search", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ query, tasks: data.tasks }),
// //   })
// //   const { taskIds } = await res.json()

// //   const filtered = data.tasks.filter((task) => taskIds.includes(task.taskId))
// //   setResult(filtered)
// // }

// // added loader
// const handleSearch = async () => {
//   setLoading(true)
//   try {
//     const res = await fetch("/api/ai-task-search", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query, tasks: data.tasks }),
//     })
//     const { taskIds } = await res.json()
//     const filtered = data.tasks.filter((task) => taskIds.includes(task.taskId))
//     setResult(filtered)
//   } catch (err) {
//     alert("Failed to fetch search results.")
//   } finally {
//     setLoading(false)
//   }
// }




//   // const handleRuleConvert = () => {
//   //   if (query.toLowerCase().includes("must run together")) {
//   //     const taskNames = query.match(/\b\w+/g) || []
//   //     const t1 = data.tasks.find((t) => query.includes(t.title))
//   //     const t2 = data.tasks.find((t) => t !== t1 && query.includes(t.title))

//   //     if (t1 && t2) {
//   //       const newRule = {
//   //         id: uuidv4(),
//   //         type: "co-run",
//   //         name: `${t1.title} + ${t2.title} must run together`,
//   //         description: `Ensure ${t1.title} and ${t2.title} are co-scheduled`,
//   //         conditions: {
//   //           task1: t1.taskId,
//   //           task2: t2.taskId,
//   //         },
//   //         actions: {},
//   //       }
//   //       setRules((prev) => [...prev, newRule])
//   //       alert("Rule created successfully ✨")
//   //     } else {
//   //       alert("Could not find matching task names")
//   //     }
//   //   } else {
//   //     alert("Currently only 'must run together' rules are supported")
//   //   }
// //   // }
// //   const handleRuleConvert = async () => {
// //   const res = await fetch("/api/ai-rule-converter", {
// //     method: "POST",
// //     body: JSON.stringify({ prompt: query }),
// //     headers: { "Content-Type": "application/json" },
// //   });

// //   const data = await res.json();
  
// //   if (data.result && data.result.type) {
// //     setRules((prev) => [...prev, { id: uuidv4(), ...data.result }]);
// //     alert("AI Rule created successfully ✨");
// //   } else {
// //     alert("Could not parse rule from your input.");
// //   }
// // };

// // const handleRuleConvert = async () => {
// //   const res = await fetch("/api/ai-rule-converter", {
// //     method: "POST",
// //     body: JSON.stringify({ prompt: query }),
// //     headers: { "Content-Type": "application/json" },
// //   });

// //   const data = await res.json();

// //   try {
// //     const parsedRule = JSON.parse(data.result.trim());

// //     if (parsedRule && parsedRule.type) {
// //       setRules((prev) => [...prev, { id: uuidv4(), ...parsedRule }]);
// //       alert("AI Rule created successfully ✨");
// //     } else {
// //       alert("AI response didn't match rule format.");
// //     }
// //   } catch (err) {
// //     alert("Could not parse rule from your input.");
// //   }

  


// // };

// // added loader ti handleRule
// const handleRuleConvert = async () => {
//   setLoading(true)
//   try {
//     const res = await fetch("/api/ai-rule-converter", {
//       method: "POST",
//       body: JSON.stringify({ prompt: query }),
//       headers: { "Content-Type": "application/json" },
//     })

//     const data = await res.json()
//     const parsedRule = JSON.parse(data.result.trim())

//     if (parsedRule && parsedRule.type) {
//       setRules((prev) => [...prev, { id: uuidv4(), ...parsedRule }])
//       alert("AI Rule created successfully ✨")
//     } else {
//       alert("AI response didn't match rule format.")
//     }
//   } catch (err) {
//     alert("Could not parse rule from your input.")
//   } finally {
//     setLoading(false)
//   }
// }


//   return (
//     <div className="space-y-4">
//       <h3 className="font-semibold text-lg">Natural Language Assistant</h3>
//       <Input
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder={placeholders}
//       />
//       <div className="flex gap-2">
//         {
//           pageType === "rules"? <Button onClick={handleRuleConvert} >
//           Convert to Rule
//         </Button>
//         : <Button onClick={handleSearch}>Search Tasks</Button>
//         }
//         {/* <Button onClick={handleSearch}>Search Tasks</Button> */}
        
//       </div>
//       {result.length > 0 && (
//         <div className="text-sm text-muted-foreground">
//           <p className="mt-4 font-medium">Filtered Tasks:</p>
//           <ul className="list-disc list-inside">
//             {result.map((task, i) => (
//               <li key={i}>{task.title} (ID: {task.taskId})</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRecoilState, useRecoilValue } from "recoil"
import { dataState, rulesState } from "@/lib/recoil/atoms"
import { v4 as uuidv4 } from "uuid"

export default function NaturalLanguageInput({ pageType }: any) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any[]>([])
  const [rules, setRules] = useRecoilState(rulesState)
  const [placeholders, setPlaceHolders] = useState("")
  const [loading, setLoading] = useState(false)
  const data = useRecoilValue(dataState)

  useEffect(() => {
    setPlaceHolders(
      pageType === "rules"
        ? "Add rule: Design and QA must run together"
        : "Ask: Show tasks in phase 2 with SkillA"
    )
  }, [pageType])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai-task-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, tasks: data.tasks }),
      })
      const { taskIds } = await res.json()
      const filtered = data.tasks.filter((task) => taskIds.includes(task.taskId))
      setResult(filtered)
    } catch (err) {
      alert("Failed to fetch search results.")
    } finally {
      setLoading(false)
    }
  }

  const handleRuleConvert = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai-rule-converter", {
        method: "POST",
        body: JSON.stringify({ prompt: query }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      const parsedRule = JSON.parse(data.result.trim())

      if (parsedRule && parsedRule.type) {
        setRules((prev) => [...prev, { id: uuidv4(), ...parsedRule }])
        alert("AI Rule created successfully ✨")
      } else {
        alert("AI response didn't match rule format.")
      }
    } catch (err) {
      alert("Could not parse rule from your input.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Natural Language Assistant</h3>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholders}
      />
      <div className="flex gap-2">
        {pageType === "rules" ? (
          <Button onClick={handleRuleConvert} disabled={loading}>
            Convert to Rule
          </Button>
        ) : (
          <Button onClick={handleSearch} disabled={loading}>
            Search Tasks
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>
          <span>AI is thinking...</span>
        </div>
      )}

      {result.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="mt-4 font-medium">Filtered Tasks:</p>
          <ul className="list-disc list-inside">
            {result.map((task, i) => (
              <li key={i}>
                {task.title} (ID: {task.taskId})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
