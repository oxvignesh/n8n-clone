import { InitialNode } from "@/components/initial-node";
import type { NodeTypes } from "@xyflow/react"

export const NodeType = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
} as const

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;