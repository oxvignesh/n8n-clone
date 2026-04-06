import { useAuthMe } from "@/hooks/use-auth-me"
import { serverClient } from "@/lib/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { FolderOpenIcon, HistoryIcon, KeyIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"
import n8nLogo from "@/assets/n8n-logo.svg"

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
]

const AppSidebar = () => {
  const { pathname } = useLocation()
  const queryClient = useQueryClient()
  const { data, isLoading } = useAuthMe()
  const navigate = useNavigate()

  const signOut = useMutation({
    mutationFn: async () => {
      const res = await serverClient.api.auth["sign-out"].post({})
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-me"], null)
      queryClient.invalidateQueries({ queryKey: ["auth-me"] })
      navigate("/")
    },
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="h-10 w-fit gap-x-4 bg-transparent px-4 hover:bg-transparent"
            render={
              <Link
                to="/"
                prefetch="render"
                className="flex items-center justify-center gap-x-4"
              />
            }
          >
            <img
              src={n8nLogo}
              alt="n8n"
              width={30}
              height={30}
              className="rounded-sm"
            />
            <span className="text-sm font-bold">n8n</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isItemActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url)
                  return (
                    <SidebarMenuButton
                      key={item.url}
                      tooltip={item.title}
                      isActive={isItemActive}
                      className="h-10 gap-x-4 px-4"
                      render={<Link to={item.url} prefetch="render" />}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {isLoading ? (
            <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-900"></div>
          ) : (
            data ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sign out"
                  className="h-10 cursor-pointer gap-x-4 px-4"
                  onClick={() => signOut.mutate()}
                  disabled={signOut.isPending}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign in"
                className="h-10 cursor-pointer gap-x-4 px-4"
                onClick={() => navigate("/sign-in")}
              >
                <LogInIcon className="h-4 w-4" />
                <span>Sign in</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
