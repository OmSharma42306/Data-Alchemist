export const rangeFromString = (str: string): number[] => {
  const [start, end] = str.split("-").map(Number)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export const validateClients = (clients: any[], tasks: any[]): any[] => {
  const errors: any[] = []
  const taskIds = tasks.map((t) => t.taskId)

  clients.forEach((client, index) => {
    if (!client.clientId) {
      errors.push({ row: index, field: "clientId", message: "Client ID is required", severity: "critical", suggestion: "Add a unique identifier for this client" })
    }

    if (!client.name) {
      errors.push({ row: index, field: "name", message: "Client name is required", severity: "critical", suggestion: "Add a name for this client" })
    }

    const duplicates = clients.filter((c) => c.clientId === client.clientId)
    if (duplicates.length > 1) {
      errors.push({ row: index, field: "clientId", message: `Duplicate client ID: ${client.clientId}`, severity: "critical", suggestion: "Ensure all client IDs are unique" })
    }

    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      errors.push({ row: index, field: "email", message: "Invalid email format", severity: "warning", suggestion: "Use a valid email format (e.g., user@domain.com)" })
    }

    if (client.priorityLevel && (client.priorityLevel < 1 || client.priorityLevel > 5)) {
      errors.push({ row: index, field: "priorityLevel", message: "Priority level must be between 1 and 5", severity: "warning", suggestion: "Use a value from 1 (highest) to 5 (lowest)" })
    }

    if (client.requestedTaskIds) {
      const ids = typeof client.requestedTaskIds === "string" ? client.requestedTaskIds.split(",") : []
      ids.forEach((tid: string) => {
        if (!taskIds.includes(tid.trim())) {
          errors.push({ row: index, field: "requestedTaskIds", message: `Unknown TaskID \"${tid}\" requested`, severity: "warning", suggestion: "Ensure all requestedTaskIds exist in tasks" })
        }
      })
    }

    if (client.attributesJson) {
      try {
        JSON.parse(client.attributesJson)
      } catch {
        errors.push({ row: index, field: "attributesJson", message: "Malformed JSON in attributes", severity: "warning", suggestion: "Fix JSON syntax (e.g., use quotes for keys and values)" })
      }
    }
  })

  return errors
}

export const validateWorkers = (workers: any[]): any[] => {
  const errors: any[] = []

  workers.forEach((worker, index) => {
    if (!worker.workerId) {
      errors.push({ row: index, field: "workerId", message: "Worker ID is required", severity: "critical", suggestion: "Add a unique identifier for this worker" })
    }

    if (!worker.name) {
      errors.push({ row: index, field: "name", message: "Worker name is required", severity: "critical", suggestion: "Add a name for this worker" })
    }

    const duplicates = workers.filter((w) => w.workerId === worker.workerId)
    if (duplicates.length > 1) {
      errors.push({ row: index, field: "workerId", message: `Duplicate worker ID: ${worker.workerId}`, severity: "critical", suggestion: "Ensure all worker IDs are unique" })
    }

    const maxLoadPerPhase = worker.maxLoadPerPhase ?? worker.maxLoadPerPhase
    if (maxLoadPerPhase !== undefined && (isNaN(maxLoadPerPhase) || maxLoadPerPhase < 0)) {
      errors.push({ row: index, field: "maxLoadPerPhase", message: "maxLoadPerPhase must be a positive number", severity: "warning", suggestion: "Enter a valid maxLoadPerPhase value (e.g., 8 for 8 hours)" })
    }

    if (!worker.skills || worker.skills.trim() === "") {
      errors.push({ row: index, field: "skills", message: "Skills are required", severity: "critical", suggestion: "Add at least one skill (e.g., SkillA;SkillB)" })
    }

    if (Array.isArray(worker.availableSlots) && worker.maxLoadPerPhase !== undefined) {
      if (worker.availableSlots.length < worker.maxLoadPerPhase) {
        errors.push({ row: index, field: "availableSlots", message: `Worker has fewer slots than max load per phase`, severity: "warning", suggestion: "Either reduce max load or increase availableSlots" })
      }
    }
  })

  return errors
}

export const validateTasks = (tasks: any[], workers: any[], clients: any[]): any[] => {
  const errors: any[] = []
  const workerIds = workers.map((w) => w.workerId)
  const clientIds = clients.map((c) => c.clientId)
  const allSkills = workers.flatMap((w) => typeof w.skills === "string" ? w.skills.split(/[,;]\s*/) : [])

  tasks.forEach((task, index) => {
    if (!task.taskId) {
      errors.push({ row: index, field: "taskId", message: "Task ID is required", severity: "critical", suggestion: "Add a unique identifier for this task" })
    }

    if (!task.title) {
      errors.push({ row: index, field: "title", message: "Task title is required", severity: "critical", suggestion: "Add a descriptive title for this task" })
    }

    const duplicates = tasks.filter((t) => t.taskId === task.taskId)
    if (duplicates.length > 1) {
      errors.push({ row: index, field: "taskId", message: `Duplicate task ID: ${task.taskId}`, severity: "critical", suggestion: "Ensure all task IDs are unique" })
    }

    if (task.assignedTo && !workerIds.includes(task.assignedTo)) {
      errors.push({ row: index, field: "assignedTo", message: `Worker ID ${task.assignedTo} not found in workers data`, severity: "critical", suggestion: "Assign to a valid worker ID or add the worker to workers data" })
    }

    if (task.clientId && !clientIds.includes(task.clientId)) {
      errors.push({ row: index, field: "clientId", message: `Client ID ${task.clientId} not found in clients data`, severity: "warning", suggestion: "Use a valid client ID or add the client to clients data" })
    }

    if (task.duration !== undefined && (isNaN(task.duration) || task.duration < 1)) {
      errors.push({ row: index, field: "duration", message: "Task duration must be at least 1", severity: "warning", suggestion: "Enter a valid duration in phases (e.g., 2)" })
    }

    if (task.requiredSkills) {
      const taskSkills = typeof task.requiredSkills === "string" ? task.requiredSkills.split(/[,;]\s*/) : []
      taskSkills.forEach((skill: string) => {
        if (!allSkills.includes(skill)) {
          errors.push({ row: index, field: "requiredSkills", message: `Skill \"${skill}\" not matched by any worker`, severity: "warning", suggestion: "Ensure this skill is listed for at least one worker" })
        }
      })
    }

    const qualifiedWorkers = workers.filter(w => {
      const taskSkills = typeof task.requiredSkills === "string" ? task.requiredSkills.split(/[,;]/) : []
      return taskSkills.some((s: string) => w.skills?.includes(s))
    })
    if (task.maxConcurrent && qualifiedWorkers.length < task.maxConcurrent) {
      errors.push({ row: index, field: "maxConcurrent", message: `MaxConcurrent (${task.maxConcurrent}) exceeds available qualified workers (${qualifiedWorkers.length})`, severity: "warning", suggestion: "Lower maxConcurrent or add more qualified workers" })
    }
  })

  return errors
}

export const validatePhaseSlotSaturation = (tasks: any[], workers: any[]): any[] => {
  const errors: any[] = []
  const phaseLoad: Record<number, number> = {}
  const totalSlots: Record<number, number> = {}

  tasks.forEach((task) => {
    let preferred: number[] = []
    if (typeof task.preferredPhases === "string") {
      preferred = task.preferredPhases.includes("-")
        ? rangeFromString(task.preferredPhases)
        : task.preferredPhases.split(/[,;]/).map(Number)
    }
    preferred.forEach((p) => {
      phaseLoad[p] = (phaseLoad[p] || 0) + (task.duration || 1)
    })
  })

  workers.forEach((w) => {
    const slots = Array.isArray(w.availableSlots) ? w.availableSlots : []
    slots.forEach((p: number) => {
      totalSlots[p] = (totalSlots[p] || 0) + (w.maxLoadPerPhase || 1)
    })
  })

  for (const phase in phaseLoad) {
    const d = phaseLoad[+phase], c = totalSlots[+phase] || 0
    if (d > c) {
      errors.push({ row: -1, field: `Phase ${phase}`, message: `Phase ${phase} is overbooked (${d} > ${c})`, severity: "warning", suggestion: "Adjust durations or worker availability" })
    }
  }

  return errors
}

export const validateCircularCoRun = (rules: any[]): any[] => {
  const errors: any[] = []
  const graph: Record<string, string[]> = {}

  rules.forEach(rule => {
    if (rule.type === "co-run") {
      const { task1, task2 } = rule.conditions || {}
      if (task1 && task2) {
        graph[task1] = [...(graph[task1] || []), task2]
      }
    }
  })

  const visited = new Set<string>()
  const recStack = new Set<string>()

  const dfs = (node: string): boolean => {
    if (!visited.has(node)) {
      visited.add(node)
      recStack.add(node)
      for (const neighbor of graph[node] || []) {
        if (!visited.has(neighbor) && dfs(neighbor)) return true
        else if (recStack.has(neighbor)) return true
      }
    }
    recStack.delete(node)
    return false
  }

  for (const node of Object.keys(graph)) {
    if (dfs(node)) {
      errors.push({ row: -1, field: "rules", message: `Circular co-run rule detected at ${node}`, severity: "critical", suggestion: "Break the cycle in your co-run rules" })
      break
    }
  }

  return errors
}

export const validateAllData = (data: { clients: any[], workers: any[], tasks: any[], rules: any[] }) => {
  return {
    clients: validateClients(data.clients, data.tasks),
    workers: validateWorkers(data.workers),
    tasks: validateTasks(data.tasks, data.workers, data.clients),
    other: [
      ...validatePhaseSlotSaturation(data.tasks, data.workers),
      ...validateCircularCoRun(data.rules),
    ]
  }
}  
