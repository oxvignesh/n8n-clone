import { HttpRequestNode } from "@/components/executions/http-request/node";
import { InitialNode } from "@/components/initial-node";
import { ManualTriggerNode } from "@/components/triggers/manual-trigger/node";
import { NodeType } from "@/lib/node-types"
import type { NodeTypes } from "@xyflow/react"

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;