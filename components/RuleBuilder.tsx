"use client"

import { useState } from "react"
import { useRecoilState } from "recoil"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { rulesState } from "@/lib/recoil/atoms"
import { Plus, Trash2, Eye } from "lucide-react"

interface Rule {
  id: string
  type: "co-run" | "load-limit" | "slot-restriction"
  name: string
  description: string
  conditions: any
  actions: any
}

export default function RuleBuilder() {
  const [rules, setRules] = useRecoilState(rulesState)
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    type: "co-run",
    name: "",
    description: "",
    conditions: {},
    actions: {},
  })
  const [showPreview, setShowPreview] = useState(false)

  const addRule = () => {
    if (!newRule.name) return

    const rule: Rule = {
      id: Date.now().toString(),
      type: newRule.type as Rule["type"],
      name: newRule.name,
      description: newRule.description || "",
      conditions: newRule.conditions || {},
      actions: newRule.actions || {},
    }

    setRules((prev) => [...prev, rule])
    setNewRule({
      type: "co-run",
      name: "",
      description: "",
      conditions: {},
      actions: {},
    })
  }

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id))
  }

  const CoRunRuleForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task1">Task 1 ID</Label>
          <Input
            id="task1"
            placeholder="Enter task ID"
            value={newRule.conditions?.task1 || ""}
            onChange={(e) =>
              setNewRule((prev) => ({
                ...prev,
                conditions: { ...prev.conditions, task1: e.target.value },
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="task2">Task 2 ID</Label>
          <Input
            id="task2"
            placeholder="Enter task ID"
            value={newRule.conditions?.task2 || ""}
            onChange={(e) =>
              setNewRule((prev) => ({
                ...prev,
                conditions: { ...prev.conditions, task2: e.target.value },
              }))
            }
          />
        </div>
      </div>
      <div>
        <Label htmlFor="relationship">Relationship</Label>
        <Select
          value={newRule.conditions?.relationship || "must-run-together"}
          onValueChange={(value) =>
            setNewRule((prev) => ({
              ...prev,
              conditions: { ...prev.conditions, relationship: value },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="must-run-together">Must run together</SelectItem>
            <SelectItem value="cannot-run-together">Cannot run together</SelectItem>
            <SelectItem value="sequential">Must run sequentially</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const LoadLimitRuleForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="group">Worker Group</Label>
        <Input
          id="group"
          placeholder="Enter worker group"
          value={newRule.conditions?.group || ""}
          onChange={(e) =>
            setNewRule((prev) => ({
              ...prev,
              conditions: { ...prev.conditions, group: e.target.value },
            }))
          }
        />
      </div>
      <div>
        <Label htmlFor="maxLoad">Maximum Load</Label>
        <Input
          id="maxLoad"
          type="number"
          placeholder="Enter max load"
          value={newRule.conditions?.maxLoad || ""}
          onChange={(e) =>
            setNewRule((prev) => ({
              ...prev,
              conditions: { ...prev.conditions, maxLoad: Number.parseInt(e.target.value) },
            }))
          }
        />
      </div>
      <div>
        <Label htmlFor="timeWindow">Time Window (hours)</Label>
        <Input
          id="timeWindow"
          type="number"
          placeholder="Enter time window"
          value={newRule.conditions?.timeWindow || ""}
          onChange={(e) =>
            setNewRule((prev) => ({
              ...prev,
              conditions: { ...prev.conditions, timeWindow: Number.parseInt(e.target.value) },
            }))
          }
        />
      </div>
    </div>
  )

  const SlotRestrictionRuleForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="slotType">Slot Type</Label>
        <Select
          value={newRule.conditions?.slotType || "time-based"}
          onValueChange={(value) =>
            setNewRule((prev) => ({
              ...prev,
              conditions: { ...prev.conditions, slotType: value },
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time-based">Time-based</SelectItem>
            <SelectItem value="resource-based">Resource-based</SelectItem>
            <SelectItem value="location-based">Location-based</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="restriction">Restriction Value</Label>
        <Input
          id="restriction"
          placeholder="Enter restriction value"
          value={newRule.conditions?.restriction || ""}
          onChange={(e) =>
            setNewRule((prev) => ({
              ...prev,
              conditions: { ...prev.conditions, restriction: e.target.value },
            }))
          }
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Rule</CardTitle>
          <CardDescription>Define custom rules for task scheduling and worker management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                placeholder="Enter rule name"
                value={newRule.name || ""}
                onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="ruleType">Rule Type</Label>
              <Select
                value={newRule.type}
                onValueChange={(value: Rule["type"]) => setNewRule((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co-run">Co-run Tasks</SelectItem>
                  <SelectItem value="load-limit">Load Limit</SelectItem>
                  <SelectItem value="slot-restriction">Slot Restriction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="ruleDescription">Description</Label>
            <Textarea
              id="ruleDescription"
              placeholder="Describe what this rule does"
              value={newRule.description || ""}
              onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {newRule.type === "co-run" && <CoRunRuleForm />}
          {newRule.type === "load-limit" && <LoadLimitRuleForm />}
          {newRule.type === "slot-restriction" && <SlotRestrictionRuleForm />}

          <div className="flex gap-2">
            <Button onClick={addRule} disabled={!newRule.name}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>

          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rule Preview (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto">{JSON.stringify(newRule, null, 2)}</pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Rules</CardTitle>
          <CardDescription>
            {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No rules created yet</p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant="secondary">{rule.type}</Badge>
                    </div>
                    {rule.description && <p className="text-sm text-muted-foreground">{rule.description}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRule(rule.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
