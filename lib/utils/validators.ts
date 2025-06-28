export const validateClients = (clients: any[]): any[] => {
  const errors: any[] = []

  clients.forEach((client, index) => {
    // Check for missing required fields
    if (!client.clientId) {
      errors.push({
        row: index,
        field: "clientId",
        message: "Client ID is required",
        severity: "critical",
        suggestion: "Add a unique identifier for this client",
      })
    }

    if (!client.name) {
      errors.push({
        row: index,
        field: "name",
        message: "Client name is required",
        severity: "critical",
        suggestion: "Add a name for this client",
      })
    }

    // Check for duplicate IDs
    const duplicates = clients.filter((c) => c.clientId === client.clientId)
    if (duplicates.length > 1) {
      errors.push({
        row: index,
        field: "clientId",
        message: `Duplicate client ID: ${client.clientId}`,
        severity: "critical",
        suggestion: "Ensure all client IDs are unique",
      })
    }

    // Validate email format
    if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      errors.push({
        row: index,
        field: "email",
        message: "Invalid email format",
        severity: "warning",
        suggestion: "Use a valid email format (e.g., user@domain.com)",
      })
    }
  })

  return errors
}

export const validateWorkers = (workers: any[]): any[] => {
  const errors: any[] = []

  workers.forEach((worker, index) => {
    // Check for missing required fields
    if (!worker.workerId) {
      errors.push({
        row: index,
        field: "workerId",
        message: "Worker ID is required",
        severity: "critical",
        suggestion: "Add a unique identifier for this worker",
      })
    }

    if (!worker.name) {
      errors.push({
        row: index,
        field: "name",
        message: "Worker name is required",
        severity: "critical",
        suggestion: "Add a name for this worker",
      })
    }

    // Check for duplicate IDs
    const duplicates = workers.filter((w) => w.workerId === worker.workerId)
    if (duplicates.length > 1) {
      errors.push({
        row: index,
        field: "workerId",
        message: `Duplicate worker ID: ${worker.workerId}`,
        severity: "critical",
        suggestion: "Ensure all worker IDs are unique",
      })
    }

    // Validate capacity
    if (worker.capacity && (isNaN(worker.capacity) || worker.capacity < 0)) {
      errors.push({
        row: index,
        field: "capacity",
        message: "Capacity must be a positive number",
        severity: "warning",
        suggestion: "Enter a valid capacity value (e.g., 8 for 8 hours)",
      })
    }
  })

  return errors
}

export const validateTasks = (tasks: any[], workers: any[], clients: any[]): any[] => {
  const errors: any[] = []
  const workerIds = workers.map((w) => w.workerId)
  const clientIds = clients.map((c) => c.clientId)

  tasks.forEach((task, index) => {
    // Check for missing required fields
    if (!task.taskId) {
      errors.push({
        row: index,
        field: "taskId",
        message: "Task ID is required",
        severity: "critical",
        suggestion: "Add a unique identifier for this task",
      })
    }

    if (!task.title) {
      errors.push({
        row: index,
        field: "title",
        message: "Task title is required",
        severity: "critical",
        suggestion: "Add a descriptive title for this task",
      })
    }

    // Check for duplicate IDs
    const duplicates = tasks.filter((t) => t.taskId === task.taskId)
    if (duplicates.length > 1) {
      errors.push({
        row: index,
        field: "taskId",
        message: `Duplicate task ID: ${task.taskId}`,
        severity: "critical",
        suggestion: "Ensure all task IDs are unique",
      })
    }

    // Validate references
    if (task.assignedTo && !workerIds.includes(task.assignedTo)) {
      errors.push({
        row: index,
        field: "assignedTo",
        message: `Worker ID ${task.assignedTo} not found in workers data`,
        severity: "critical",
        suggestion: "Assign to a valid worker ID or add the worker to workers data",
      })
    }

    if (task.clientId && !clientIds.includes(task.clientId)) {
      errors.push({
        row: index,
        field: "clientId",
        message: `Client ID ${task.clientId} not found in clients data`,
        severity: "warning",
        suggestion: "Use a valid client ID or add the client to clients data",
      })
    }

    // Validate priority
    if (task.priority && !["High", "Medium", "Low"].includes(task.priority)) {
      errors.push({
        row: index,
        field: "priority",
        message: "Priority must be High, Medium, or Low",
        severity: "warning",
        suggestion: "Use one of: High, Medium, Low",
      })
    }

    // Validate deadline format
    if (task.deadline && isNaN(Date.parse(task.deadline))) {
      errors.push({
        row: index,
        field: "deadline",
        message: "Invalid deadline format",
        severity: "warning",
        suggestion: "Use a valid date format (e.g., YYYY-MM-DD)",
      })
    }
  })

  return errors
}

export const validateAllData = (data: { clients: any[]; workers: any[]; tasks: any[] }) => {
  return {
    clients: validateClients(data.clients),
    workers: validateWorkers(data.workers),
    tasks: validateTasks(data.tasks, data.workers, data.clients),
  }
}
