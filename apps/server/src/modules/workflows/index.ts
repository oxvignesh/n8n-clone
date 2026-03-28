import { Elysia } from "elysia"

import { Workflow } from "./service"
import { WorkflowModel } from "./model"
import { isAuthenticated } from "../../middleware/auth"

export const app = new Elysia({ prefix: "/api/workflows" })
// .use(isAuthenticated)
  .get(
    "/",
    async ({ status }) => {
      const workflows = await Workflow.getWorkflows()

      if (!workflows) {
        return status(400, {
          message: "Error while fetching workflows",
        })
      }

      return {workflows}
    },
    {
      response: {
        200: WorkflowModel.getWorkflows,
        400: WorkflowModel.getWorkflowsFailed,
      },
    }
  )
  .post(
    "/test-ai",
    async ({ status }) => {
      const test = await Workflow.testAI()

      return status(200, {
        message: "AI job queued",
      })
    },
    {
      response: {
        200: WorkflowModel.testAI,
      },
    }
  )
