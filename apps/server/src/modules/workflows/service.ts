import { prisma } from "@workspace/db"
import { inngest } from "../../inngest/client";

export abstract class Workflow {
  static async getWorkflows() {
    const workflows = await prisma.workflow.findMany();
    return workflows;
  }

  static async createWorkflow() {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "wikky@gmail.com"
      }
    })
  }
}