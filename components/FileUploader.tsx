"use client"

import { useCallback, useState } from "react"
import { useRecoilState } from "recoil"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { dataState, validationState } from "@/lib/recoil/atoms"
import { parseFile, normalizeHeaders } from "@/lib/utils/fileParser"
import { validateAllData } from "@/lib/utils/validators"

interface FileUploadStatus {
  name: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
  type: "clients" | "workers" | "tasks"
}

export default function FileUploader() {
  const [data, setData] = useRecoilState(dataState)
  const [, setValidation] = useRecoilState(validationState)
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus[]>([])

  const handleFileUpload = useCallback(
    async (files: FileList, type: "clients" | "workers" | "tasks") => {
      const file = files[0]
      if (!file) return

      const fileStatus: FileUploadStatus = {
        name: file.name,
        status: "uploading",
        progress: 0,
        type,
      }

      setUploadStatus((prev) => [...prev.filter((f) => f.type !== type), fileStatus])

      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 20) {
          setUploadStatus((prev) => prev.map((f) => (f.type === type ? { ...f, progress: i } : f)))
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        const rawData = await parseFile(file)
        const normalizedData = normalizeHeaders(rawData, type)

        setData((prev) => ({
          ...prev,
          [type]: normalizedData,
        }))

        setUploadStatus((prev) => prev.map((f) => (f.type === type ? { ...f, status: "success", progress: 100 } : f)))

        // Run validation
        const updatedData = { ...data, [type]: normalizedData }
        const validationResults = validateAllData(updatedData)
        setValidation(validationResults)
      } catch (error) {
        setUploadStatus((prev) =>
          prev.map((f) =>
            f.type === type
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        )
      }
    },
    [data, setData, setValidation],
  )

  const FileUploadCard = ({ type, title }: { type: "clients" | "workers" | "tasks"; title: string }) => {
    const status = uploadStatus.find((f) => f.type === type)
    const hasData = data[type].length > 0

    return (
      <Card className="relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold">{title}</h3>
            </div>
            {hasData && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {data[type].length} records
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById(`file-${type}`)?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">CSV or XLSX files only</p>
            </div>

            <input
              id={`file-${type}`}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files, type)}
            />

            {status && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{status.name}</span>
                  {status.status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {status.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                {status.status === "uploading" && <Progress value={status.progress} className="w-full" />}
                {status.error && <p className="text-xs text-red-500">{status.error}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FileUploadCard type="clients" title="Clients Data" />
      <FileUploadCard type="workers" title="Workers Data" />
      <FileUploadCard type="tasks" title="Tasks Data" />
    </div>
  )
}
