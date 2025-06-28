"use client"

import { useState } from "react"
import { useRecoilState, useRecoilValue,useSetRecoilState } from "recoil"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { dataState, validationState } from "@/lib/recoil/atoms"
import { Edit, Save, X, AlertTriangle } from "lucide-react"
import {validateAllData} from "@/lib/utils/validators"

export default function DataGrid() {
  const [data, setData] = useRecoilState(dataState)
  const validation = useRecoilValue(validationState)
  const [editingCell, setEditingCell] = useState<{ type: string; row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState("")

  const setValidation = useSetRecoilState(validationState) 

  const handleEdit = (type: "clients" | "workers" | "tasks", rowIndex: number, column: string, value: string) => {
    setEditingCell({ type, row: rowIndex, col: column })
    setEditValue(value)
  }


  const handleSave = () => {
  if (!editingCell) return

  const { type, row, col } = editingCell

  let updatedData = {} as typeof data

  // 1. First, update the data
  setData((prev) => {
    updatedData = {
      ...prev,
      [type]: prev[type as keyof typeof prev].map((item: any, index: number) =>
        index === row ? { ...item, [col]: editValue } : item,
      ),
    }
    return updatedData
  })

  // 2. Then, update the validation AFTER state update is scheduled
  setTimeout(() => {
    const newValidation = validateAllData(updatedData)
    setValidation(newValidation)
  }, 0)

  setEditingCell(null)
}
  // const handleSave = () => {
  //   if (!editingCell) return

  //   const { type, row, col } = editingCell
  //   setData((prev) => ({
  //     ...prev,
  //     [type]: prev[type as keyof typeof prev].map((item: any, index: number) =>
  //       index === row ? { ...item, [col]: editValue } : item,
  //     ),
  //   }))
  //   setEditingCell(null)
  // }

  const handleCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const getValidationErrors = (type: string, rowIndex: number, column: string) => {
    const typeValidation = validation[type as keyof typeof validation]
    if (!typeValidation) return []

    return typeValidation.filter((error: any) => error.row === rowIndex && error.field === column)
  }

  const DataTable = ({ type, title }: { type: "clients" | "workers" | "tasks"; title: string }) => {
    const tableData = data[type]
    if (!tableData || tableData.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No {title.toLowerCase()} data uploaded yet</div>
    }

    const columns = Object.keys(tableData[0] || {})

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline">{tableData.length} records</Badge>
        </div>

        <ScrollArea className="h-[400px] w-full border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {columns.map((col) => (
                  <TableHead key={col} className="min-w-[120px]">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                  {columns.map((col) => {
                    const cellValue = row[col]
                    const errors = getValidationErrors(type, rowIndex, col)
                    const isEditing =
                      editingCell?.type === type && editingCell?.row === rowIndex && editingCell?.col === col

                    return (
                      <TableCell key={col} className="relative">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8"
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" onClick={handleSave}>
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className={`flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded ${
                              errors.length > 0 ? "bg-red-50 border border-red-200" : ""
                            }`}
                            onClick={() => handleEdit(type, rowIndex, col, cellValue)}
                          >
                            <span className="flex-1">{cellValue || "-"}</span>
                            {errors.length > 0 && <AlertTriangle className="w-3 h-3 text-red-500" />}
                            <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                          </div>
                        )}
                        {errors.length > 0 && !isEditing && (
                          <div className="absolute top-full left-0 z-10 mt-1 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700 shadow-lg">
                            {errors.map((error: any, i: number) => (
                              <div key={i}>{error.message}</div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    )
  }

  return (
    <Tabs defaultValue="clients" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="workers">Workers</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="clients">
        <DataTable type="clients" title="Clients Data" />
      </TabsContent>

      <TabsContent value="workers">
        <DataTable type="workers" title="Workers Data" />
      </TabsContent>

      <TabsContent value="tasks">
        <DataTable type="tasks" title="Tasks Data" />
      </TabsContent>
    </Tabs>
  )
}
