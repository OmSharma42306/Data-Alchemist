"use client"

import { useRecoilValue } from "recoil"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { dataState, rulesState, priorityState } from "@/lib/recoil/atoms"
import { exportToExcel, exportToCSV, exportRulesJSON } from "@/lib/utils/exportUtils"
import { Download, FileText, Settings, BarChart3 } from "lucide-react"

export default function ExportPanel() {
  const data = useRecoilValue(dataState)
  const rules = useRecoilValue(rulesState)
  const priorities = useRecoilValue(priorityState)

  const handleExportCSV = async (type: "clients" | "workers" | "tasks") => {
    const csvData = data[type]
    if (csvData.length === 0) {
      alert(`No ${type} data to export`)
      return
    }

    await exportToCSV(csvData, `${type}.csv`)
  }

  const handleExportExcel = async () => {
    const hasData = data.clients.length > 0 || data.workers.length > 0 || data.tasks.length > 0
    if (!hasData) {
      alert("No data to export")
      return
    }

    await exportToExcel(
      {
        clients: data.clients,
        workers: data.workers,
        tasks: data.tasks,
      },
      "cleaned_data.xlsx",
    )
  }

  const handleExportRules = async () => {
    if (rules.length === 0) {
      alert("No rules to export")
      return
    }

    const rulesConfig = {
      rules,
      priorities,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    await exportRulesJSON(rulesConfig, "rules_config.json")
  }

  const DataExportCard = ({
    type,
    title,
    count,
  }: {
    type: "clients" | "workers" | "tasks"
    title: string
    count: number
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <h3 className="font-medium">{title}</h3>
          </div>
          <Badge variant={count > 0 ? "secondary" : "outline"}>{count} records</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          onClick={() => handleExportCSV(type)}
          disabled={count === 0}
        >
          <Download className="w-3 h-3 mr-2" />
          Export CSV
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Summary</CardTitle>
          <CardDescription>Export your cleaned data and configuration files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{data.clients.length}</div>
              <div className="text-sm text-muted-foreground">Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{data.workers.length}</div>
              <div className="text-sm text-muted-foreground">Workers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{data.tasks.length}</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{rules.length}</div>
              <div className="text-sm text-muted-foreground">Rules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataExportCard type="clients" title="Clients Data" count={data.clients.length} />
        <DataExportCard type="workers" title="Workers Data" count={data.workers.length} />
        <DataExportCard type="tasks" title="Tasks Data" count={data.tasks.length} />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Complete Data Export
            </CardTitle>
            <CardDescription>Export all data in a single Excel file with multiple sheets</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportExcel}
              disabled={data.clients.length === 0 && data.workers.length === 0 && data.tasks.length === 0}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel Workbook
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Rules Configuration
            </CardTitle>
            <CardDescription>Export rules and priority settings as JSON configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Active Rules:</span>
                <Badge>{rules.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Priority Weights:</span>
                <Badge>{Object.keys(priorities).length}</Badge>
              </div>
              <Button
                variant="outline"
                onClick={handleExportRules}
                disabled={rules.length === 0}
                className="w-full bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Rules JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Export Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong>Individual CSV files:</strong> Export each data type separately for targeted analysis
            </p>
            <p>
              • <strong>Excel Workbook:</strong> All data in one file with separate sheets for easy comparison
            </p>
            <p>
              • <strong>Rules JSON:</strong> Configuration file that can be imported later or used by other systems
            </p>
            <p>
              • <strong>File naming:</strong> Exports include timestamps to avoid overwriting previous versions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
