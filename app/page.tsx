"use client"

import { RecoilRoot } from "recoil"
import DataValidationApp from "@/components/DataValidationApp"

export default function Home() {
  return (
    <RecoilRoot>
      <div className="min-h-screen bg-background">
        <DataValidationApp />
      </div>
    </RecoilRoot>
  )
}
