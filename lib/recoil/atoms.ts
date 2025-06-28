import { atom } from "recoil"

export const dataState = atom({
  key: "dataState",
  default: {
    clients: [] as any[],
    workers: [] as any[],
    tasks: [] as any[],
  },
})

export const validationState = atom({
  key: "validationState",
  default: {
    clients: [] as any[],
    workers: [] as any[],
    tasks: [] as any[],
  },
})

export const rulesState = atom({
  key: "rulesState",
  default: [] as any[],
})

export const priorityState = atom({
  key: "priorityState",
  default: {
    priorityLevel: 70,
    loadBalance: 30,
    deadline: 50,
    resourceAvailability: 40,
    taskComplexity: 35,
  },
})
