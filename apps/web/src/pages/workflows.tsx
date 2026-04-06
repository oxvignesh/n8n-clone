import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components"
import { useWorkflowsParams } from "@/hooks/use-workflow-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import { serverClient } from "@/lib/constants"
import type { WorkflowListItem } from "@/lib/workflow-api-types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { WorkflowIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function Workflows() {
  return <WorkflowsContent />
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Workflows"
      description="Create and manage your workflows"
      disabled={disabled}
      isCreating={false}
    />
  )
}

export const WorkflowsContainer = ({
  children,
  header,
  search,
  pagination,
}: {
  children: React.ReactNode
  header: React.ReactNode
  search: React.ReactNode
  pagination: React.ReactNode
}) => {
  return (
    <EntityContainer header={header} search={search} pagination={pagination}>
      {children}
    </EntityContainer>
  )
}

export const WorkflowsSearch = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <EntitySearch
      value={value}
      onChange={onChange}
      placeholder="Search workflows"
    />
  )
}

export const WorkflowsList = ({
  items,
  isLoading,
  isError,
  errorMessage,
  onRemove,
  removingId,
}: {
  items: WorkflowListItem[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRemove: (id: string) => void
  removingId: string | null
}) => {
  if (isLoading) {
    return <LoadingView message="Loading workflows…" />
  }

  if (isError) {
    return <ErrorView message={errorMessage ?? "Could not load workflows"} />
  }

  return (
    <EntityList<WorkflowListItem>
      items={items}
      getKey={(w) => w.id}
      emptyView={<EmptyView message="No workflows found" />}
      renderItem={(workflow) => (
        <EntityItem
          href={`/workflows/${workflow.id}`}
          title={workflow.name}
          subtitle={
            <>
              Updated{" "}
              {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
              &bull; Created{" "}
              {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
            </>
          }
          image={
            <div className="flex size-8 items-center justify-center">
              <WorkflowIcon className="size-5 text-muted-foreground" />
            </div>
          }
          onRemove={() => onRemove(workflow.id)}
          isRemoving={removingId === workflow.id}
        />
      )}
    />
  )
}

export const WorkflowsPagination = ({
  disabled,
  totalPages,
  page,
  onPageChange,
}: {
  disabled?: boolean
  totalPages: number
  page: number
  onPageChange: (page: number) => void
}) => {
  return (
    <EntityPagination
      disabled={disabled}
      totalPages={totalPages}
      page={page}
      onPageChange={onPageChange}
    />
  )
}

function WorkflowsContent() {
  const queryClient = useQueryClient()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const [params, setParams] = useWorkflowsParams()
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
    debounceMs: 500,
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workflows", params.page, params.pageSize, params.search],
    queryFn: async () => {
      const res = await serverClient.api.workflows.get({
        query: {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search,
        },
      })
      if (!res) throw new Error("Could not fetch workflows")
      if (res.error) throw res.error
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await serverClient.api.workflows.delete({
        id,
      })
      if (!res) throw new Error("Could not delete workflow")
      if (res.error) throw res.error
      return res.data
    },
    onMutate: (id) => {
      setRemovingId(id)
    },
    onSettled: () => {
      setRemovingId(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] })
      toast.success("Workflow deleted")
    },
    onError: () => {
      toast.error("Failed to delete workflow")
    },
  })

  const errorMessage =
    error instanceof Error ? error.message : "Could not load workflows"

  const totalPages = data?.totalPages ?? 1
  const currentPage = data?.page ?? params.page ?? 1

  return (
    <WorkflowsContainer
      header={<WorkflowsHeader disabled={isLoading} />}
      search={<WorkflowsSearch value={searchValue} onChange={onSearchChange} />}
      pagination={
        <WorkflowsPagination
          disabled={isLoading}
          totalPages={totalPages}
          page={currentPage}
          onPageChange={(nextPage) =>
            setParams({
              ...params,
              page: Math.min(Math.max(nextPage, 1), totalPages),
            })
          }
        />
      }
    >
      <WorkflowsList
        items={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRemove={(id) => deleteMutation.mutate(id)}
        removingId={removingId}
      />
    </WorkflowsContainer>
  )
}
