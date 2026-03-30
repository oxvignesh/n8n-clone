import { prisma } from "@workspace/db"

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

  static async getWorkflow(id: string) {
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: id,
      },
    })
    return workflow
  }

  static async createWorkflow(name: string, userId: string) {
    const workflow = await prisma.workflow.create({
      data: {
        name: name,
        userId: userId,
      },
    })
    return workflow
  }
  static async updateWorkflow(id: string, name: string, userId: string) {
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
