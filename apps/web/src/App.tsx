import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { createBrowserRouter, RouterProvider } from "react-router"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { RootLayoutA, RootLayoutB, RootLayoutC } from "./components/layout"
import Landing from "./pages/landing"
import Credential from "./pages/credential"
import Credentials from "./pages/credentials"
import Execution from "./pages/execution"
import Executions from "./pages/executions"
import Workflows from "./pages/workflows"
import Workflow from "./pages/workflow"
import NotFound from "./pages/not-found"
import SignIn from "./pages/sign-in"
import SignUp from "./pages/sign-up"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    element: <RootLayoutA />,
    children: [
      {
        element: <RootLayoutB />,
        children: [
          {
            path: "/credentials",
            element: <Credentials />,
          },
          {
            path: "/credentials/:credentialId",
            element: <Credential />,
          },
          {
            path: "/executions",
            element: <Executions />,
          },
          {
            path: "/executions/:executionId",
            element: <Execution />,
          },
          {
            path: "/workflows",
            element: <Workflows />,
          },
        ],
      },
      {
        element: <RootLayoutC />,
        children: [
          {
            path: "/workflows/:workflowId",
            index: true,
            element: <Workflow />,
          },
        ],
      },
    ],
  },
])

const queryClient = new QueryClient()

export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </TooltipProvider>
      </QueryClientProvider>
      <Toaster position="bottom-right" />
    </>
  )
}
