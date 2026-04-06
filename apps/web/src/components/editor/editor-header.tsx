import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
// import {
//   useUpdateWorkflow
// } from "@/features/workflows/hooks/use-workflows"
import { serverClient } from "@/lib/constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { useAtomValue } from "jotai"
import { SaveIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { Link, useParams } from "react-router"
// import { editorAtom } from "../store/atoms"

export const EditorSaveButton = () => {
  // const { workflowId } = useParams()
  // const editor = useAtomValue(editorAtom)
  // const saveWorkflow = useUpdateWorkflow()

  // const handleSave = () => {
    // if (!editor) {
    //   return
    // }

    // const nodes = editor.getNodes()
    // const edges = editor.getEdges()

    // saveWorkflow.mutate({
    //   id: workflowId,
    //   nodes,
    //   edges,
    // })
  // }

  return (
    <div className="ml-auto">
      <Button size="sm" 
      // onClick={handleSave} 
      // disabled={saveWorkflow.isPending}
      >
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  )
}

export const EditorNameInput = () => {
  const { workflowId } = useParams()
  const { data: workflow} = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      const res = await serverClient.api.workflows({ id: workflowId! }).get()
      if (!res) throw new Error("Could not fetch workflow")
      if (res.error) throw res.error
      return res.data
    },
  })
  const queryClient = useQueryClient()
  const updateWorkflowName = useMutation({
    mutationFn: async (name: string) => {
      const res = await serverClient.api.workflows["update-name"].put({
        id: workflowId!,
        name: name,
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", workflowId] })
      toast.success("Workflow updated")
    },
    onError: () => {
      toast.error("Failed to update workflow")
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(workflow?.name ?? "")

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (workflow?.name) {
      setName(workflow.name)
    }
  }, [workflow?.name])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (name === workflow?.name) {
      setIsEditing(false)
      return
    }

    try {
      await updateWorkflowName.mutateAsync(name)
    } catch {
      setName(workflow?.name ?? "")
    } finally {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setName(workflow?.name ?? "")
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        disabled={updateWorkflowName.isPending}
        ref={inputRef}
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-[100px] px-2"
      />
    )
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer transition-colors hover:text-foreground"
    >
      {workflow?.name ?? ""}
    </BreadcrumbItem>
  )
}

export const EditorBreadcrumbs = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to="/workflows" prefetch="render">
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput />
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export const EditorHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger />
      <div className="flex w-full flex-row items-center justify-between gap-x-4">
        <EditorBreadcrumbs />
        <EditorSaveButton/>
      </div>
    </header>
  )
}
