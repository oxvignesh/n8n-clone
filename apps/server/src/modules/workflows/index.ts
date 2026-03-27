import { Elysia } from "elysia"

import { Workflow } from "./service"
import { WorkflowModel } from "./model"
import { isAuthenticated } from "../../middleware/auth"

export const app = new Elysia({ prefix: "/api/workflows" })
    .use(isAuthenticated)
    .get(
        "/",
        async ({ userId, status }) => {
            const workflows = await Workflow.getWorkflows()

            if (!workflows) {
                return status(400, {
                    message: "Error while fetching user details",
                })
            }

            return workflows
        },
        {
            response: {
                200: WorkflowModel.getWorkflows,
                400: WorkflowModel.getWorkflowsFailed,
            },
        }
    )