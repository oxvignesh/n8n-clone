import { Toaster } from "react-hot-toast"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { createBrowserRouter, RouterProvider } from "react-router"
import { RootLayoutA, RootLayoutB, RootLayoutC } from "./components/layout"
import Landing from "./pages/landing"
import Credential from "./pages/credential"
import Credentials from "./pages/credentials"
import Execution from "./pages/execution"
import Executions from "./pages/executions"
import Workflows from "./pages/workflows"
import Workflow from "./pages/workflow"
import NotFound from "./pages/not-found"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    element: <RootLayoutA />,
    errorElement: <NotFound />,
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

export function App() {
  return (
    <>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
      <Toaster position="bottom-right" />
    </>
  )
}
