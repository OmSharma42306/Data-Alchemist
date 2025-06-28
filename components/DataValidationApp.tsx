"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FileUploader from "./FileUploader"
import DataGrid from "./DataGrid"
import RuleBuilder from "./RuleBuilder"
import PrioritizationPanel from "./PrioritizationPanel"
import ValidationSummary from "./ValidationSummary"
import ExportPanel from "./ExportPanel"
import { Upload, Grid, Settings, BarChart3, Download, AlertTriangle } from "lucide-react"

export default function DataValidationApp() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Data Validation & Processing App</h1>
        <p className="text-muted-foreground">Upload, validate, and process your CSV/XLSX data with custom rules</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Data Grid
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="priority" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Priority
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Upload & Parser</CardTitle>
              <CardDescription>Upload your CSV or XLSX files for clients, workers, and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editable Data Grid</CardTitle>
              <CardDescription>View and edit your data with inline validation</CardDescription>
            </CardHeader>
            <CardContent>
              <DataGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
              <CardDescription>Review all validation errors and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ValidationSummary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule Builder</CardTitle>
              <CardDescription>
                Create custom rules for co-run tasks, load limits, and slot restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RuleBuilder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prioritization Panel</CardTitle>
              <CardDescription>Set weights and priorities for task scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <PrioritizationPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Export cleaned data and rules configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <ExportPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
