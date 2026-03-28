import { prisma } from "@workspace/db"
import { inngest } from "../../inngest/client";

export abstract class Workflow {
  static async getWorkflows() {
    const workflows = await prisma.workflow.findMany();
    return workflows;
  }

  static async testAI() {
    await inngest.send({
      name: "execute/ai"
    })
  }
}