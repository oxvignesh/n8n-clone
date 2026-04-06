import { NodeType, prisma } from "@workspace/db"
import { Inngest, NonRetriableError } from "inngest"
import { topologicalSort } from "./utils"
import { getExecutor } from "../lib/executor-registry"

// create a client to send and receive events
export const inngest = new Inngest({ id: "n8n-clone" })

const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: [{ event: "workflows/execute.workflow" }],
  },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing")
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      })
      return topologicalSort(workflow.nodes, workflow.connections)
    })

    //initialize context with any initial data from the trigger
    let context = event.data.initialData || {}

    // execute each node

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId: event.data.userId,
        context,
        step,
      })
    }

    return {
      workflowId,
      context,
    }
  }
)

// add the function to the exported array:
export const functions = [executeWorkflow]
