"use client"

import { useRecoilValue } from "recoil"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { validationState } from "@/lib/recoil/atoms"
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"

export default function ValidationSummary() {
  const validation = useRecoilValue(validationState)

  const getTotalErrors = () => {
    return Object.values(validation).reduce((total, errors) => total + errors.length, 0)
  }

  const getErrorsByType = (type: string) => {
    return validation[type as keyof typeof validation] || []
  }

  const getErrorSeverity = (error: any) => {
    if (error.severity === "critical") return "destructive"
    if (error.severity === "warning") return "default"
    return "secondary"
  }

  const getErrorIcon = (error: any) => {
    if (error.severity === "critical") return <XCircle className="w-4 h-4" />
    if (error.severity === "warning") return <AlertTriangle className="w-4 h-4" />
    return <Info className="w-4 h-4" />
  }

  const ErrorList = ({ errors, title }: { errors: any[]; title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant={errors.length > 0 ? "destructive" : "secondary"}>
            {errors.length} issue{errors.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">No validation errors found</span>
          </div>
        ) : (
          <div className="space-y-2">
            {errors.map((error: any, index: number) => (
              <Alert key={index} variant={getErrorSeverity(error) as any}>
                <div className="flex items-start gap-2">
                  {getErrorIcon(error)}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-medium">{error.message}</div>
                      {error.field && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Field: {error.field} | Row: {error.row + 1}
                        </div>
                      )}
                      {error.suggestion && (
                        <div className="text-xs text-blue-600 mt-1">Suggestion: {error.suggestion}</div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const totalErrors = getTotalErrors()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {totalErrors > 0 ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            Validation Overview
          </CardTitle>
          <CardDescription>
            {totalErrors === 0
              ? "All data validation checks passed successfully"
              : `Found ${totalErrors} validation issue${totalErrors !== 1 ? "s" : ""} that need attention`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {getErrorsByType("clients").filter((e: any) => e.severity === "critical").length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {getErrorsByType("clients").filter((e: any) => e.severity === "warning").length +
                  getErrorsByType("workers").filter((e: any) => e.severity === "warning").length +
                  getErrorsByType("tasks").filter((e: any) => e.severity === "warning").length}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {getErrorsByType("clients").filter((e: any) => e.severity === "info").length +
                  getErrorsByType("workers").filter((e: any) => e.severity === "info").length +
                  getErrorsByType("tasks").filter((e: any) => e.severity === "info").length}
              </div>
              <div className="text-sm text-muted-foreground">Info</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            Clients
            {getErrorsByType("clients").length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {getErrorsByType("clients").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workers" className="flex items-center gap-2">
            Workers
            {getErrorsByType("workers").length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {getErrorsByType("workers").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            Tasks
            {getErrorsByType("tasks").length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {getErrorsByType("tasks").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ErrorList errors={getErrorsByType("clients")} title="Client Data Validation" />
        </TabsContent>

        <TabsContent value="workers">
          <ErrorList errors={getErrorsByType("workers")} title="Worker Data Validation" />
        </TabsContent>

        <TabsContent value="tasks">
          <ErrorList errors={getErrorsByType("tasks")} title="Task Data Validation" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
