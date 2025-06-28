"use client"

import { useRecoilState } from "recoil"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { priorityState } from "@/lib/recoil/atoms"
import { BarChart3, RefreshCw } from "lucide-react"

export default function PrioritizationPanel() {
  const [priorities, setPriorities] = useRecoilState(priorityState)

  const updatePriority = (key: string, value: number) => {
    setPriorities((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetToDefaults = () => {
    setPriorities({
      priorityLevel: 70,
      loadBalance: 30,
      deadline: 50,
      resourceAvailability: 40,
      taskComplexity: 35,
    })
  }

  const totalWeight = Object.values(priorities).reduce((sum, val) => sum + val, 0)

  const PrioritySlider = ({
    label,
    priorityKey,
    value,
    description,
  }: {
    label: string
    priorityKey: string
    value: number
    description: string
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline">{value}%</Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => updatePriority(priorityKey, values[0])}
        max={100}
        step={5}
        className="w-full"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Priority Weights Configuration
          </CardTitle>
          <CardDescription>Adjust the weights for different priority factors in task scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PrioritySlider
            label="Priority Level"
            priorityKey="priorityLevel"
            value={priorities.priorityLevel ?? 70}
            description="Weight given to task priority level (High, Medium, Low)"
          />

          <PrioritySlider
            label="Load Balance"
            priorityKey="loadBalance"
            value={priorities.loadBalance ?? 30}
            description="Weight for distributing tasks evenly across workers"
          />

          <PrioritySlider
            label="Deadline Urgency"
            priorityKey="deadline"
            value={priorities.deadline ?? 50}
            description="Weight for tasks approaching their deadlines"
          />

          <PrioritySlider
            label="Resource Availability"
            priorityKey="resourceAvailability"
            value={priorities.resourceAvailability ?? 40}
            description="Weight for available worker capacity and skills"
          />

          <PrioritySlider
            label="Task Complexity"
            priorityKey="taskComplexity"
            value={priorities.taskComplexity ?? 35}
            description="Weight for task difficulty and estimated duration"
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm font-medium">Total Weight</p>
              <p className="text-xs text-muted-foreground">
                {totalWeight > 100 ? "Weights exceed 100% - consider rebalancing" : "Weights are balanced"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={totalWeight > 100 ? "destructive" : "secondary"}>{totalWeight}%</Badge>
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority Preview</CardTitle>
          <CardDescription>How tasks will be ranked based on current weights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">High Priority Tasks</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Tasks with high priority level ({priorities.priorityLevel}% weight)</li>
                  <li>• Urgent deadlines ({priorities.deadline}% weight)</li>
                  <li>• Complex tasks requiring immediate attention</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Balanced Scheduling</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Load distribution ({priorities.loadBalance}% weight)</li>
                  <li>• Resource optimization ({priorities.resourceAvailability}% weight)</li>
                  <li>• Task complexity consideration ({priorities.taskComplexity}% weight)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
