import fs from 'fs/promises'
import path from 'path'
import { ensureDirExists } from '../utils.js'

const TASKS_DIR = 'tasks'

export function getTasksPath() {
  return path.join(process.cwd(), TASKS_DIR)
}

export const TASK_TEMPLATE_WORKSPACE = `
import { task } from 'lift'

task((context) => {
  console.log('Hello from task!')
})
`

export const TASK_TEMPLATE_CONTRACT = `
import { contractTask } from 'lift'

contractTask((context, contract) => {
  console.log('Hello from contract task!')
})
`

export async function createTask(
  name: string,
  template = TASK_TEMPLATE_WORKSPACE,
) {
  const tasksPath = getTasksPath()
  ensureDirExists(tasksPath)

  const taskFileName = `${name}.js`
  await fs.writeFile(
    path.join(tasksPath, taskFileName),
    template.trim(),
    'utf8',
  )

  console.log(`New task created at ${TASKS_DIR}/${taskFileName}`)
}
