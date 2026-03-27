import { t } from "elysia";

export namespace WorkflowModel {
    export const getWorkflows = t.Object({
        workflows: t.Array(t.Object({
            id: t.String(),
            name: t.String()
        })),
    });
    export type getWorkflows = typeof getWorkflows.static;

    export const getWorkflowsFailed = t.Object({
        message: t.Literal("Error while fetching workflows"),
    });
    export type getWorkflowsFailed = typeof getWorkflowsFailed.static;
}
