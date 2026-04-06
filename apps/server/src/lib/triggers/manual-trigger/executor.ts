import { NodeExecutor } from "../../types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({data, nodeId, context, step}) => {
    //todo - publish loading state
    const result = await step.run("manual-trigger", async () => context);

    //todo - publish success state

    return result;
}