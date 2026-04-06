import { t } from "elysia"
import { PAGINATION } from "../../lib/constants"

export namespace WorkflowModel {
  export const getWorkflows = t.Object({
    page: t.Number({default: PAGINATION.DEFAULT_PAGE, minimum: 1}),
    pageSize: t.Number({default: PAGINATION.DEFAULT_PAGE_SIZE, minimum: PAGINATION.MIN_PAGE_SIZE, maximum: PAGINATION.MAX_PAGE_SIZE}),
    search: t.String({default: ""}),
  })
  export type getWorkflows = typeof getWorkflows.static

  export const getWorkflowsSuccess = t.Object({
    items: t.Array(t.Object({
      id: t.String(),
      name: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      userId: t.String(),
    })),
    page: t.Number(),
    pageSize: t.Number(),
    totalCount: t.Number(),
    totalPages: t.Number(),
    hasNextPage: t.Boolean(),
    hasPreviousPage: t.Boolean(),
  })
  export type getWorkflowsSuccess = typeof getWorkflowsSuccess.static

  export const getWorkflowsFailed = t.Object({
    message: t.Literal("Error while fetching workflows"),
  })
  export type getWorkflowsFailed = typeof getWorkflowsFailed.static

  export const ReactFlowNode = t.Object({
    id: t.String(),
    type: t.Nullable(t.String()),
    position: t.Object({
      x: t.Number(),
      y: t.Number(),
    }),
    data: t.Record(t.String(), t.Optional(t.Any())),
  })
  export type ReactFlowNode = typeof ReactFlowNode.static

  export const ReactFlowEdge = t.Object({
    id: t.Optional(t.String()),
    source: t.String(),
    target: t.String(),
    sourceHandle: t.Nullable(t.String()),
    targetHandle: t.Nullable(t.String()),
  })
  export type ReactFlowEdge = typeof ReactFlowEdge.static

  export const getWorkflow = t.Object({
    id: t.String(),
    name: t.String(),
  })
  export type getWorkflow = typeof getWorkflow.static

  export const getWorkflowSuccess =  t.Object({
    id: t.String(),
    name: t.String(),
    nodes: t.Array(ReactFlowNode),
    edges: t.Array(ReactFlowEdge),
  })
  export type getWorkflowSuccess = typeof getWorkflowSuccess.static

  export const getWorkflowFailed = t.Object({
    message: t.Literal("Error while fetching workflow"),
  })
  export type getWorkflowFailed = typeof getWorkflowFailed.static

  export const createWorkflow = t.Object({
    name: t.String({minLength: 3, maxLength: 20, regex: /^[a-zA-Z0-9]+$/}),
  })
  export type createWorkflow = typeof createWorkflow.static

  export const createWorkflowSuccess = t.Object({
    id: t.String(),
    name: t.String(),
  })
  export type createWorkflowSuccess = typeof createWorkflowSuccess.static

  export const createWorkflowFailed = t.Object({
    message: t.Literal("Error while creating workflow"),
  })
  export type createWorkflowFailed = typeof createWorkflowFailed.static

  export const updateWorkflow = t.Object({
    id: t.String(),
    nodes: t.Array(ReactFlowNode),
    edges: t.Array(ReactFlowEdge),
  })
  export type updateWorkflow = typeof updateWorkflow.static

  export const updateWorkflowSuccess = t.Object({
    id: t.String(),
    name: t.String(),
  })
  export type updateWorkflowSuccess = typeof updateWorkflowSuccess.static

  export const updateWorkflowFailed = t.Object({
    message: t.Literal("Error while updating workflow"),
  })
  export type updateWorkflowFailed = typeof updateWorkflowFailed.static

  export const updateWorkflowName = t.Object({
    id: t.String(),
    name: t.String({minLength: 3, maxLength: 20, regex: /^[a-zA-Z0-9]+$/}),
  })
  export type updateWorkflowName = typeof updateWorkflowName.static

  export const updateWorkflowNameSuccess = t.Object({
    id: t.String(),
    name: t.String(),
  })
  export type updateWorkflowNameSuccess = typeof updateWorkflowNameSuccess.static

  export const updateWorkflowNameFailed = t.Object({
    message: t.Literal("Error while updating workflow name"),
  })
  export type updateWorkflowNameFailed = typeof updateWorkflowNameFailed.static

  export const executeWorkflow = t.Object({
    id: t.String(),
  })
  export type executeWorkflow = typeof executeWorkflow.static

  export const executeWorkflowSuccess = t.Object({
    id: t.String(),
    name: t.String(),
  })
  export type executeWorkflowSuccess = typeof executeWorkflowSuccess.static

  export const executeWorkflowFailed = t.Object({
    message: t.Literal("Error while executing workflow"),
  })
  export type executeWorkflowFailed = typeof executeWorkflowFailed.static

  export const deleteWorkflow = t.Object({
    id: t.String(),
  })
  export type deleteWorkflow = typeof deleteWorkflow.static

  export const deleteWorkflowSuccess = t.Object({
    id: t.String(),
  })
  export type deleteWorkflowSuccess = typeof deleteWorkflowSuccess.static

  export const deleteWorkflowFailed = t.Object({
    message: t.Literal("Error while deleting workflow"),
  })
  export type deleteWorkflowFailed = typeof deleteWorkflowFailed.static
}