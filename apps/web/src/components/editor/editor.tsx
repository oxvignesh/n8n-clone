"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import {
    Background,
    Controls,
    MiniMap,
    Panel,
    ReactFlow,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
} from "@xyflow/react"
import { useCallback, useMemo, useState } from "react"

import { nodeComponents, NodeType } from "@/lib/node-components"
import { serverClient } from "@/lib/constants"
import { useQuery } from "@tanstack/react-query"
import "@xyflow/react/dist/style.css"
// import { useSetAtom } from "jotai"
// import { editorAtom } from "../store/atoms"
// import { AddNodeButton } from "./add-node-button"
// import { ExecuteWorkflowButton } from "./execute-workflow-button"

import { useParams } from "react-router"

import { useTheme } from "@/components/theme-provider"
import { AddNodeButton } from "./add-node-button"

export const Editor = () => {
  const { theme } = useTheme()
  const { workflowId } = useParams()
  const { data: workflow, isLoading, isError, error } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      const res = await serverClient.api.workflows({ id: workflowId! }).get()
      if (!res) throw new Error("Could not fetch workflow")
      if (res.error) throw res.error
      return res.data
    },
  })

  // const setEditor = useSetAtom(editorAtom)

  const [nodes, setNodes] = useState<Node[]>(workflow?.nodes || [])
  const [edges, setEdges] = useState<Edge[]>(workflow?.edges || [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER)
  }, [nodes])

  const errorMessage = error instanceof Error ? error.message : "Could not load editor"

  if (isLoading) {
    return <LoadingView message="Loading editor…" />
  }
  if (isError) {
    return <ErrorView message={errorMessage} />
  }

  return (
    <div className="size-full">
      <ReactFlow
        colorMode={theme}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        // onInit={setEditor}
        fitView
        proOptions={{ hideAttribution: true }}
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            {/* <ExecuteWorkflowButton workflowId={workflowId} /> */}
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
