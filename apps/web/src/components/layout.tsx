import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Outlet } from "react-router"
import AppHeader from "./app-header"
import AppSidebar from "./app-sidebar"

export const RootLayoutA= () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export const RootLayoutB = () => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  )
}

export const RootLayoutC = () => {
  return (
    <>
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  )
}