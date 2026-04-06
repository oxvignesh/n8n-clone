import { Elysia } from "elysia"
import { isAuthenticated } from "../../middleware/auth"
import { WorkflowModel } from "./model"
import { Workflow } from "./service"

export const app = new Elysia({ prefix: "/api/workflows" })
  .use(isAuthenticated)
  .get(
    "/",
    async ({ status, query }) => {
      const workflows = await Workflow.getWorkflows(query.page, query.pageSize, query.search)

      if (!workflows) {
        return status(400, {
          message: "Error while fetching workflows",
        })
      }

      return workflows
    },
    {
      query: WorkflowModel.getWorkflows,
      response: {
        200: WorkflowModel.getWorkflowsSuccess,
        400: WorkflowModel.getWorkflowsFailed,
      },
    }
  )
  .get(
    "/:id",
    async ({ status, params, userId }) => {
      const workflow = await Workflow.getWorkflow(params.id, userId)
      if (!workflow) {
        return status(400, {
          message: "Error while fetching workflow",
        })
      }
      return workflow
    },
    {
      response: {
        200: WorkflowModel.getWorkflowSuccess,
        400: WorkflowModel.getWorkflowFailed,
      },
    }
  )
  .post(
    "/create",
    async ({ userId, status, body }) => {
      const workflow = await Workflow.createWorkflow(body.name, userId)
      if (!workflow) {
        return status(400, {
          message: "Error while creating workflow",
        })
      }
      return {
        id: workflow.id,
        name: workflow.name,
      }
    },
    {
      body: WorkflowModel.createWorkflow,
      response: {
        200: WorkflowModel.createWorkflowSuccess,
        400: WorkflowModel.createWorkflowFailed,
      },
    }
  )
  .put(
    "/update",
    async ({ userId, status, body }) => {
      const workflow = await Workflow.updateWorkflow(body.id, body.nodes, body.edges, userId)
      if (!workflow) {
        return status(400, {
          message: "Error while updating workflow",
        })
      }
      return {
        id: workflow.id,
        name: workflow.name,
      }
    },
    {
      body: WorkflowModel.updateWorkflow,
      response: {
        200: WorkflowModel.updateWorkflowSuccess,
        400: WorkflowModel.updateWorkflowFailed,
      },
    }
  )
  .put(
    "/update-name",
    async ({ userId, status, body }) => {
      const workflow = await Workflow.updateWorkflowName(body.id, body.name, userId)
      if (!workflow) {
        return status(400, {
          message: "Error while updating workflow name",
        })
      }
      return {
        id: workflow.id,
        name: workflow.name,
      }
    },
    {
      body: WorkflowModel.updateWorkflowName,
      response: {
        200: WorkflowModel.updateWorkflowNameSuccess,
        400: WorkflowModel.updateWorkflowNameFailed,
      },
    }
  )
  .post("/execute", async ({ userId, status, body }) => {
    const workflow = await Workflow.executeWorkflow(body.id, userId)
    if (!workflow) {
      return status(400, {
        message: "Error while executing workflow",
      })
    }
    return workflow
  }, {
    body: WorkflowModel.executeWorkflow,
    response: {
      200: WorkflowModel.executeWorkflowSuccess,
      400: WorkflowModel.executeWorkflowFailed,
    },
  })
  .delete(
    "/",
    async ({ userId, status, body }) => {
      const workflow = await Workflow.deleteWorkflow(body.id, userId)
      if (!workflow) {
        return status(400, {
          message: "Error while deleting workflow",
        })
      }
      return {
        id: workflow.id,
      }
    },
    {
      body: WorkflowModel.deleteWorkflow,
      response: {
        200: WorkflowModel.deleteWorkflowSuccess,
        400: WorkflowModel.deleteWorkflowFailed,
      },
    }
  )