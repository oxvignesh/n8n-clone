import { serverClient } from "@/lib/constants"

type WorkflowsGetResult = Awaited<
  ReturnType<typeof serverClient.api.workflows.get>
>

/** Single workflow row from GET /api/workflows */
export type WorkflowListItem = NonNullable<
  WorkflowsGetResult["data"]
>["items"][number]

type WorkflowByIdResponse = Awaited<
  ReturnType<ReturnType<typeof serverClient.api.workflows>["get"]>
>

/** Success body from GET /api/workflows/:id */
export type WorkflowDetail = NonNullable<WorkflowByIdResponse["data"]>

export type ApiReactFlowNode = WorkflowDetail["nodes"][number]
export type ApiReactFlowEdge = WorkflowDetail["edges"][number]
