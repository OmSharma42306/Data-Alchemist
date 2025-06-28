import { useSetRecoilState, useRecoilValue } from "recoil"
import { dataState, validationState } from "@/lib/recoil/atoms"
import { validateAllData } from "@/lib/utils/validators"

export const useDataUpdater = () => {
  const setData = useSetRecoilState(dataState)
  const setValidation = useSetRecoilState(validationState)
  const currentData = useRecoilValue(dataState)

  const updateData = (type: "clients" | "workers" | "tasks", rowIndex: number, field: string, value: any) => {
    const newData = { ...currentData,rules:[] }
    const updatedItem = { ...newData[type][rowIndex], [field]: value }
    newData[type][rowIndex] = updatedItem

    setData(newData)
    setValidation(validateAllData(newData))
  }

  return updateData
}
