import { Button } from "@workspace/ui/components/button"

export function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Hello World!</h1>
          <Button className="mt-2">Button</Button>
        </div>
      </div>
    </div>
  )
}
