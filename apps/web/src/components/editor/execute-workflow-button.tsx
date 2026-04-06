import { serverClient } from "@/lib/constants"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { FlaskConicalIcon } from "lucide-react"
import toast from "react-hot-toast"

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string
}) => {
  const executeWorkflow = useMutation({
    mutationFn: async () => {
      const res = await serverClient.api.workflows.execute.post({
        id: workflowId!,
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: async () => {
      toast.success("Workflow executed")
    },
    onError: () => {
      toast.error("Failed to execute workflow")
    },
  })

  const handleExecute = () => {
    executeWorkflow.mutate()
  }

  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  )
}
