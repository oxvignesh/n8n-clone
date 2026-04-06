import { prisma } from "@workspace/db"
import { NodeType } from "@workspace/db"
import { WorkflowModel } from "./model"

export abstract class Workflow {
  static async getWorkflows(page: number, pageSize: number, search: string) {
    const [items, totalCount] = await Promise.all([
      prisma.workflow.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          name: { contains: search, mode: "insensitive" },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.workflow.count({
        where: {
          name: { contains: search, mode: "insensitive" },
        },
      }),
    ])
    const totalPages = Math.ceil(totalCount / pageSize)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    }
  }

  static async getWorkflow(id: string, userId: string) {
    const workflow = await prisma.workflow.findUniqueOrThrow({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        nodes: true,
        connections: true,
      },
    })

    const nodes = workflow.nodes.map((node) => ({
      id: node.id,
      type: String(node.type),
      position: node.position as { x: number; y: number },
      data: (node.data as Record<string, unknown>) || {},
    }))

    const edges = workflow.connections.map((connection) => ({
      id: connection.id,
      source: connection.fromNodeId,
      target: connection.toNodeId,
      sourceHandle: connection.fromOutput,
      targetHandle: connection.toInput,
    }))

    return {
      id: workflow.id,
      name: workflow.name,
      nodes,
      edges,
    }
  }

  static async createWorkflow(name: string, userId: string) {
    const workflow = await prisma.workflow.create({
      data: {
        name: name,
        userId: userId,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: {
              x: 0,
              y: 0,
            },
            name: NodeType.INITIAL,
          },
        },
      },
    })
    return workflow
  }
  static async updateWorkflow(
    id: string,
    nodes: WorkflowModel.ReactFlowNode[],
    edges: WorkflowModel.ReactFlowEdge[],
    userId: string
  ) {
    const workflow = await prisma.workflow.findUniqueOrThrow({
      where: {
        id: id,
        userId: userId,
      },
    })

    //transaction
    await prisma.$transaction(async (tx) => {
      //delete all nodes and connections
      await tx.node.deleteMany({
        where: { workflowId: id },
      })

      //create new nodes
      await tx.node.createMany({
        data: nodes.map((node) => ({
          id: node.id,
          workflowId: id,
          name: node.type || "unknown",
          type: node.type as NodeType,
          position: node.position,
          data: node.data || {},
        })),
      })

      //create new connections
      await tx.connection.createMany({
        data: edges.map((edge) => ({
          workflowId: id,
          fromNodeId: edge.source,
          toNodeId: edge.target,
          fromOutput: edge.sourceHandle || "main",
          toInput: edge.targetHandle || "main",
        })),
      })

      //update the workflow updatedAt timestamp
      await tx.workflow.update({
        where: { id: id },
        data: { updatedAt: new Date() },
      })
    })

    return workflow
  }

  static async updateWorkflowName(id: string, name: string, userId: string) {
    const workflow = await prisma.workflow.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        name: name,
      },
    })
    return workflow
  }
  static async deleteWorkflow(id: string, userId: string) {
    const workflow = await prisma.workflow.delete({
      where: {
        id: id,
        userId: userId,
      },
    })
    return workflow
  }
}
